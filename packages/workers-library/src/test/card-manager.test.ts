import KV from '../kv';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { env } from 'cloudflare:test';
import TradingCardManager, { Card } from '../card-manager';

afterEach(() => {
	vi.spyOn(env.AI, 'run').mockRestore();
});

describe('test CardManager class', () => {
	// type cast is due to some weirdness with the AI workers types. See env.ts
	const cardManager = new TradingCardManager(env.KV, env.AI as Ai);

	it('generateCard()', async () => {
		const title = 'test title';
		const description = 'test string';

		const imageData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
		const expectedPrompt = {
			prompt: [
				`Based on the following title and description, generate card artwork for a trading card`,
				`title: ${title}`,
				`description: ${description}`,
			].join('\n'),
		};
		const mockAI = vi.spyOn(env.AI, 'run').mockResolvedValueOnce(imageData);

		const card = await cardManager.generateCard(title, description);

		expect(card.title).toStrictEqual(title);
		expect(card.description).toStrictEqual(description);
		expect(card.imageData).toStrictEqual(imageData);

		expect(mockAI).toHaveBeenCalledWith(
			'@cf/stabilityai/stable-diffusion-xl-base-1.0',
			expectedPrompt
		);
		expect(mockAI).toHaveBeenCalledOnce();
	});

	it('saveCard()', async () => {});

	it('getCard()', async () => {});
});
