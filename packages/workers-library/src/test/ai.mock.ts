// We have to redefine the AI type here because `AI.run` defaults to using
// image to text models, which causes type errors. I beleive there's a fix in progress,
// which would allow us to specify the types for `.run` via some generics

// see: https://github.com/cloudflare/workerd/issues/2181
export interface MockAiImageModel {
	run: (
		model: BaseAiTextToImageModels,
		input: AiTextToImageInput,
		options?: AiOptions
	) => Promise<AiTextToImageOutput>;
}

class MockAi implements MockAiImageModel {
	async run(
		model: BaseAiTextToImageModels,
		prompt: AiTextToImageInput,
		options?: AiOptions
	): Promise<AiTextToImageOutput> {
		console.warn('Unmocked AI.run: ', model, prompt, options);
		return new Uint8Array();
	}
}

export default function () {
	return new MockAi();
}
