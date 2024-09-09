export interface Card {
	title: string;
	description: string;
	imageUrl: string;
}

// This could be replaced with a Zod validator
function isCard(card: unknown): card is Card {
	return (
		typeof card === 'object' &&
		card !== null &&
		'title' in card &&
		typeof card.title === 'string' &&
		'description' in card &&
		typeof card.description === 'string' &&
		'imageUrl' in card &&
		typeof card.imageUrl === 'string'
	);
}

/**
 * Trading card manager class that wraps KV, R2, and Workers AI. Handles all of our "business" logic
 */
export default class TradingCardManager {
	constructor(
		public kvBinding: KVNamespace,
		public aiBinding: Ai,
		public r2Binding: R2Bucket,
		public bucketDomain: string
	) {}

	/**
	 * @param card card title and description to generate
	 * @returns card key in KV
	 */
	async generateAndSaveCard(card: Pick<Card, 'title' | 'description'>): Promise<string> {
		const key = crypto.randomUUID();

		const cardToSave = {
			...card,
			imageUrl: `https://${this.bucketDomain}/${key}`,
		};

		const cardData = await this.generateCardArt(card);

		await Promise.all([
			this.r2Binding.put(key, cardData),
			this.kvBinding.put(key, JSON.stringify(cardToSave)),
		]);

		return key;
	}

	/**
	 * @param card metadata for the trading card, including the title and description
	 * @returns fully populated card data
	 */
	async generateCardArt(card: Pick<Card, 'title' | 'description'>): Promise<Uint8Array> {
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
		return imageData;
	}

	/**
	 * @param cardKey card key to get
	 * @returns card from cardKey
	 */
	async getCard(cardKey: string): Promise<Card | null> {
		const card = await this.kvBinding.get(cardKey, 'json');

		if (!card) {
			// key not found
			return null;
		}

		if (!isCard(card)) {
			throw new Error('Invalid card returned from KV');
		}

		return card;
	}
}
