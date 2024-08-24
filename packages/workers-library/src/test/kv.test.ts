import KV from '../kv'
import { describe, expect, it } from 'vitest'
import { env } from 'cloudflare:test'

describe('test KV wrapper class', () => {
	it('KV.setFoo()', async () => {
		const kv = new KV(env.KV)

		await kv.setFoo('testValue')
		expect(await env.KV.get('foo')).toBe('testValue')
	})

	it('KV.getFoo()', async () => {
		const kv = new KV(env.KV)

		const shouldBeNull = await kv.getFoo()
		expect(shouldBeNull).toBeNull()

		await env.KV.put('foo', 'test')
		const shouldBeTest = await kv.getFoo()
		expect(shouldBeTest).toBe('test')
	})

	it('repeatedly get/set', async () => {
		const kv = new KV(env.KV)

		await kv.setFoo('newTest')
		const newTest = await kv.getFoo()
		expect(newTest).toBe('newTest')
	})
})
