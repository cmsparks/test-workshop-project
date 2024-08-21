import {
	BaseAiTextToImage,
	Ai,
	type KVNamespace,
	BaseAiTextToImageModels,
	AiTextToImageInput,
	AiOptions,
} from '@cloudflare/workers-types';

declare module 'cloudflare:test' {
	interface ProvidedEnv {
		KV: KVNamespace;
		AI: MockAiImageModel;
	}
}

// I think we have to redefine the AI type here because `AI.run` defaults to using
// image to text models, which causes type errors. I beleive there's a fix in progress,
// which would allow us to specify the types for `.run` via some generics
// see: https://github.com/cloudflare/workerd/issues/2181
interface MockAiImageModel {
	run: (
		model: BaseAiTextToImageModels,
		input: AiTextToImageInput,
		options?: AiOptions
	) => Promise<AiTextToImageOutput>;
}
