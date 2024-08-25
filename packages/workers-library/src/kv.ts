import { type KVNamespace } from '@cloudflare/workers-types';

/**
 * Example class that wrapps Cloudflare KV
 */
export default class KV {
	kv: KVNamespace;

	constructor(kvBinding: KVNamespace) {
		this.kv = kvBinding;
	}

	async setFoo(fooVal: string): Promise<void> {
		await this.kv.put('foo', fooVal);
	}

	async getFoo(): Promise<string | null> {
		return await this.kv.get('foo');
	}
}
