import { Ai, type KVNamespace } from '@cloudflare/workers-types';

export type Card = {
	title: string;
	description: string;

	// raw image data in the PNG format
	imageData: Uint8Array;
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
		throw new Error('unimplemented');
	}

	/**
	 * @param card card data to save to KV
	 * @returns card key in KV
	 */
	async saveCard(card: Card): Promise<string> {
		throw new Error('unimplemented');
	}

	/**
	 * @param cardKey card key to get
	 * @returns card from cardKey
	 */
	async getCard(cardKey: string): Promise<Card> {
		throw new Error('unimplemented');
	}
}
