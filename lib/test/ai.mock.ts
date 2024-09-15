import { AiImageModel } from 'lib/card-manager';

class MockAi implements AiImageModel {
	async run(
		model: BaseAiTextToImageModels,
		prompt: AiTextToImageInput,
		options?: AiOptions
	): Promise<ReadableStream<Uint8Array>> {
		console.warn('Unmocked AI.run: ', model, prompt, options);
		return new Blob([new Uint8Array()]).stream();
	}
}

export default function () {
	return new MockAi();
}
