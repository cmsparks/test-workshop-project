import { type KVNamespace } from '@cloudflare/workers-types';
import { MockAiImageModel } from './ai.mock';

declare module 'cloudflare:test' {
	interface ProvidedEnv {
		KV: KVNamespace;
		AI: MockAiImageModel;
	}
}
