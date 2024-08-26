import { Ai, type KVNamespace } from '@cloudflare/workers-types';

export interface Card extends CardMetadata {
	imageData: Uint8Array;
}

export interface CardMetadata {
	title: string;
	description: string;
}

/**
 * Example class that wrapps Cloudflare KV
 */
export default class TradingCardManager {
	constructor(
		public kvBinding: KVNamespace,
		public aiBinding: Ai
	) {}

	/**
	 * @param card metadata for the trading card, including the title and description
	 * @returns fully populated card data
	 */
	async generateAndSaveCard(card: CardMetadata): Promise<Card> {
		// create prompt
		const input = {
			prompt: [
				`Based on the following title and description, generate card artwork for a trading card`,
				`title: ${card.title}`,
				`description: ${card.description}`,
			].join('\n'),
		};

		// generate image data from aiBinding
		const imageData = await this.aiBinding.run(
			'@cf/stabilityai/stable-diffusion-xl-base-1.0',
			input
		);

		// return card
		return {
			...card,
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
