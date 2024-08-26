import { Ai, type KVNamespace } from '@cloudflare/workers-types';

const KV_KEY_PREFIX = '/card/';

export type Card = CardMetadata & {
	// raw image data in the PNG format
	imageData: Uint8Array;
};

export type CardMetadata = {
	title: string;
	description: string;
};

/**
 * Example class that wrapps Cloudflare KV
 */
export default class TradingCardManager {
	constructor(
		public kvBinding: KVNamespace,
		public aiBinding: Ai
	) {}

	/**
	 * @param title title of the trading card
	 * @param description description of the card
	 * @returns fully populated card data
	 */
	async generateCard(title: string, description: string): Promise<Card> {
		// create prompt
		const input = {
			prompt: [
				`Based on the following title and description, generate card artwork for a trading card`,
				`title: ${title}`,
				`description: ${description}`,
			].join('\n'),
		};

		// generate image data from aiBinding
		const imageData = await this.aiBinding.run(
			'@cf/stabilityai/stable-diffusion-xl-base-1.0',
			input
		);

		// return card
		return {
			title,
			description,
			imageData,
		};
	}

	/**
	 * @param card card data to save to KV
	 * @returns card key in KV
	 */
	async saveCard(card: Card): Promise<string> {
		const kvKey = crypto.randomUUID();

		await this.kvBinding.put(kvKey, card.imageData, {
			metadata: {
				title: card.title,
				description: card.description,
			},
		});

		return kvKey;
	}

	/**
	 * @param cardKey card key to get
	 * @returns card from cardKey
	 */
	async getCard(cardKey: string): Promise<Card | null> {
		const { value, metadata } = await this.kvBinding.getWithMetadata<CardMetadata>(
			cardKey,
			'arrayBuffer'
		);

		if (!value) {
			// key not found
			return null;
		}

		if (metadata === null) {
			throw new Error('No card metadata');
		}

		if (!('title' in metadata) || !('description' in metadata)) {
			throw new Error('Invalid card metadata');
		}

		return {
			title: metadata.title,
			description: metadata.description,
			imageData: new Uint8Array(value),
		};
	}
}
