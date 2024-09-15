import TradingCardManager, { AiImageModel } from 'card-manager/card-manager';

export const onRequest: PagesFunction<Env> = async (context) => {
	const manager = new TradingCardManager(
		context.env.KV,
		context.env.AI as unknown as AiImageModel, // this is a bug with workers AI types
		context.env.BUCKET,
		context.env.BUCKET_DOMAIN
	);
	const key = await manager.generateAndSaveCard({
		title: 'Test card',
		description: 'Test description',
	});
	return new Response(key);
};
