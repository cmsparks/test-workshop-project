import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form, redirect, useActionData, useLoaderData, useNavigation } from '@remix-run/react';

import Card from '@components/card';
import confetti from 'canvas-confetti';
import { type AiImageModel, TradingCardManager } from 'card-manager';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Trading Card Generator' },
		{
			name: 'description',
			content: 'A trading card generator',
		},
	];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const searchParams = url.searchParams;
	const cardId = searchParams.get('card-id');
	const retrieveCardDetails = !!cardId;
	if (retrieveCardDetails) {
		const isNew = !!searchParams.get('new');

		const { env } = context.cloudflare;

		const cardManager = new TradingCardManager(
			env.KV,
			env.AI as unknown as AiImageModel,
			env.BUCKET
		);

		const card = await cardManager.getCard(cardId);

		if (!card) {
			return null;
		}

		return {
			isNew,
			...card,
		};
	}
	return null;
}

export async function action({ context, request }: ActionFunctionArgs) {
	try {
		const body = await request.formData();
		const title = body.get('card-title');
		const description = body.get('card-description');

		if (!title) {
			return { error: 'no title was provided' };
		}

		if (!description) {
			return { error: 'no description was provided' };
		}

		const { env } = context.cloudflare;

		const cardManager = new TradingCardManager(
			env.KV,
			env.AI as unknown as AiImageModel,
			env.BUCKET
		);

		const cardId = await cardManager.generateAndSaveCard({
			title: title.toString(),
			description: description.toString(),
		});

		return redirect(`/?card-id=${cardId}&new=1`);
	} catch (e) {
		const error = `Error: ${e instanceof Error ? e.message : e}`;
		return { error };
	}
}

type LoaderType = Awaited<ReturnType<typeof loader>>;
type ActionType = Awaited<ReturnType<typeof action>>;

export default function Index() {
	const cardDetails = useLoaderData<LoaderType>();
	const actionResult = useActionData<ActionType>();
	const actionError = actionResult && 'error' in actionResult ? actionResult.error : null;

	const { state } = useNavigation();
	const submitting = state === 'submitting';

	if (actionError) {
		// TODO: to properly implement
		return (
			<>
				<h1>ERROR</h1>
				<p>{actionError}</p>
			</>
		);
	}

	return (
		<main className="main">
			{cardDetails === null ? (
				<Form className="card-form" method="post">
					{submitting && (
						<div className="card-form__loading">
							<div className="loader"></div>
						</div>
					)}
					<div className={`card ${submitting ? 'card--faded' : ''}`}>
						<div className="card__image"></div>
						<input
							data-testid="card-title-input"
							className="card__title card__title--input"
							type="text"
							name="card-title"
							id="card-title"
							disabled={submitting}
							placeholder="title"
							required
						/>
						<textarea
							data-testid="card-description-input"
							className="card__description card__description--input"
							name="card-description"
							id="card-description"
							disabled={submitting}
							placeholder="description..."
							required
						></textarea>
					</div>
					<button
						data-testid="card-generate-btn"
						disabled={submitting}
						className={'btn btn--generate'}
					>
						Generate
					</button>
				</Form>
			) : (
				<Card
					cardDetails={cardDetails}
					newCardEffect={() =>
						confetti({
							particleCount: 150,
							spread: 90,
						})
					}
				></Card>
			)}
		</main>
	);
}
