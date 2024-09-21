import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ params, context }: LoaderFunctionArgs) {
	const r2Obj = await context.cloudflare.env.BUCKET.get(params.key!);
	if (!r2Obj) {
		throw new Response(null, {
			status: 404,
			statusText: 'Not Found',
		});
	}

	return new Response(r2Obj.body, {
		headers: {
			'content-type': 'image/png',
		},
	});
}
