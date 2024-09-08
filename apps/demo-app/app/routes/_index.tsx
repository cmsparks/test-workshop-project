import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form, redirect, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

import Card from '@components/card';

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
		// TODO: fetch card details from KV
		return {
			isNew,
			title: 'a test title',
			description: 'a test description',
			img: 'test image',
		};
	}
	return null;
}

export async function action({ context, request }: ActionFunctionArgs) {
	// TODO: save card to KV and generate image
	const cardSaved = await new Promise<boolean>((r) =>
		setTimeout(() => {
			r(true);
		}, 2_000)
	);
	if (cardSaved) {
		return redirect('/?card-id=123&new=1');
	} else {
		const error = 'an error occurred';
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

	useEffect(() => {
		if (cardDetails?.isNew) {
			confetti({
				particleCount: 150,
				spread: 90,
			});
		}
	}, [cardDetails]);

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
					<button data-testid="card-generate-btn" className="btn btn--generate">
						Generate
					</button>
				</Form>
			) : (
				<Card cardDetails={cardDetails}></Card>
			)}
		</main>
	);
}
