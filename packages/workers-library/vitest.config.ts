import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersProject({
	test: {
		hookTimeout: 60_000,
		poolOptions: {
			workers: {
				singleWorker: true,
				miniflare: {
					compatibilityDate: '2024-06-03',
					compatibilityFlags: ['nodejs_compat'],
					kvNamespaces: ['KV'],
					// https://github.com/cloudflare/workers-sdk/blob/main/packages/miniflare/README.md#browser-rendering-and-workers-ai
					// AI Bindings currently aren't supported, so we need to mock the API ourselves
					wrappedBindings: {
						AI: {
							scriptName: 'mock-ai',
						},
					},
					workers: [
						{
							name: 'mock-ai',
							modules: true,
							script: `
							class MockAi {
								constructor(env) {}
							
								async run(model, prompt, options) {
									console.warn("Unmocked AI.run: ", model, prompt, options)
									return null
								}
							}
							
							export default function(env) {
								return new MockAi(env)
							}
							`,
						},
					],
				},
			},
		},
	},
});
