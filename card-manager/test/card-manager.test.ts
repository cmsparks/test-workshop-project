import { afterEach, assert, describe, expect, it, vi } from 'vitest';
import { env } from 'cloudflare:test';
import TradingCardManager, { AiImageModel, Card } from '../card-manager';

afterEach(() => {
	vi.spyOn(env.AI, 'run').mockRestore();
});

describe('test CardManager class', () => {
	// type cast is due to some weirdness with the AI workers types. See env.ts
	const cardManager = new TradingCardManager(
		env.KV,
		env.AI as AiImageModel,
		env.R2,
		env.BUCKET_DOMAIN
	);

	it('generateAndSaveCard()', async () => {
		const title = 'test title';
		const description = 'test description';

		// create a large array that gets buffered into multiple chunks
		const imageArray = Uint8Array.from({ length: 100000 }, () => Math.floor(Math.random() * 100));
		const imageBlob = new Blob([imageArray]);
		const stream = imageBlob.stream();
		const expectedPrompt = {
			prompt: [
				`Based on the following title and description, generate card artwork for a trading card`,
				`title: ${title}`,
				`description: ${description}`,
			].join('\n'),
		};
		const mockAI = vi.spyOn(env.AI, 'run').mockResolvedValueOnce(stream);

		const cardKey = await cardManager.generateAndSaveCard({ title, description });

		expect(mockAI).toHaveBeenCalledWith(
			'@cf/stabilityai/stable-diffusion-xl-base-1.0',
			expectedPrompt
		);
		expect(mockAI).toHaveBeenCalledOnce();

		// validate data in R2
		const r2cardData = await env.R2.get(cardKey);
		assert(r2cardData !== null);
		expect(new Uint8Array(await r2cardData.arrayBuffer())).toStrictEqual(imageArray);

		// and in KV
		const kvCard = (await env.KV.get(cardKey, 'json')) as Card;
		expect(kvCard.title).toStrictEqual('test title');
		expect(kvCard.description).toStrictEqual('test description');
		expect(kvCard.imageUrl).toStrictEqual(`https://${env.BUCKET_DOMAIN}/${cardKey}`);
	});

	it('generateCardArt()', async () => {
		const title = 'test title';
		const description = 'test description';

		const imageData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
		const expectedPrompt = {
			prompt: [
				`Based on the following title and description, generate card artwork for a trading card`,
				`title: ${title}`,
				`description: ${description}`,
			].join('\n'),
		};
		const mockAI = vi.spyOn(env.AI, 'run').mockResolvedValueOnce(imageData);

		const cardData = await cardManager.generateCardArt({ title, description });

		expect(cardData).toStrictEqual(imageData);

		expect(mockAI).toHaveBeenCalledWith(
			'@cf/stabilityai/stable-diffusion-xl-base-1.0',
			expectedPrompt
		);
		expect(mockAI).toHaveBeenCalledOnce();
	});

	it('getCard(): null card', async () => {
		const nullCard = await cardManager.getCard('nonexistent-key');

		expect(nullCard).toBeNull();
	});

	it('getCard(): non-null card', async () => {
		const uuid = crypto.randomUUID();

		await env.KV.put(
			uuid,
			JSON.stringify({
				title: 'test title',
				description: 'test description',
				imageUrl: 'https://example.com/testKey',
			})
		);

		const card = await cardManager.getCard(uuid);
		expect(card?.title).toStrictEqual('test title');
		expect(card?.description).toStrictEqual('test description');
		expect(card?.imageUrl).toStrictEqual('https://example.com/testKey');
	});
});
