declare module 'cloudflare:test' {
	interface ProvidedEnv {
		KV: KVNamespace;
		AI: AiImageModel;
		R2: R2Bucket;
		BUCKET_DOMAIN: string;
	}
}
