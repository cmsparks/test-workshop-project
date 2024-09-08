import { MockAiImageModel } from './ai.mock';

declare module 'cloudflare:test' {
	interface ProvidedEnv {
		KV: KVNamespace;
		AI: MockAiImageModel;
		R2: R2Bucket;
		BUCKET_DOMAIN: string;
	}
}
