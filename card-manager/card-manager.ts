/**
 *  We have to redefine the AI type here for a number of reasons.
 * 1) `AI.run` defaults to using image to text models, which causes type
 * errors while testing. I believe there's a fix in progress, which would
 * allow us to specify the types for `.run` via some generics. See:
 * https://github.com/cloudflare/workerd/issues/2181
 *
 * 2) The types for AiTextToImageOutput are incorrect. It is defined as an
 * Uint8Array, but is actually a ReadableStream. See:
 * https://github.com/cloudflare/workerd/issues/2470
 * */
export interface AiImageModel {
	run: (
		model: BaseAiTextToImageModels,
		input: AiTextToImageInput,
		options?: AiOptions
	) => Promise<ReadableStream<Uint8Array>>;
}

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
		public aiBinding: AiImageModel,
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

		// we don't know the length of the readable stream returned from ai.run(),
		// so we need to read it all into a buffer so we can use it in r2Binding.put()

		// 1) read the entire ReadableStream to get the data and length
		const reader = cardData.getReader();
		const buffer = [];
		let totalLength = 0;
		while (true) {
			const { done, value } = await reader.read();
			console.log('uploading part');
			if (done) break;
			buffer.push(value);
			totalLength += value.byteLength;
		}

		// 2) convert to a statically sized Uint8Array()
		const arrayBuffer = new Uint8Array(totalLength);
		let offset = 0;
		for (const value of buffer) {
			arrayBuffer.set(value, offset);
			offset += value.byteLength;
		}

		await Promise.all([
			this.r2Binding.put(key, arrayBuffer),
			this.kvBinding.put(key, JSON.stringify(cardToSave)),
		]);

		return key;
	}

	/**
	 * @param card metadata for the trading card, including the title and description
	 * @returns fully populated card data
	 */
	async generateCardArt(
		card: Pick<Card, 'title' | 'description'>
	): Promise<ReadableStream<Uint8Array>> {
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
