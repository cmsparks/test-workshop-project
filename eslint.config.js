import baseConfig from '@repo/eslint-config/base.js'

export default [
	...baseConfig,
	{
		ignores: ['apps/**', 'packages/**'],
	}
]