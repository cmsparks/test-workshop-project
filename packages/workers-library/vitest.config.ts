import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config'

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
				},
			},
		},
	},
})
