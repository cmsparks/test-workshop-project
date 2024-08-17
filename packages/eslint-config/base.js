const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: ['turbo', 'prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	plugins: ['@typescript-eslint'],
	settings: {
		'import/resolver': {
			typescript: {
				project,
			},
		},
	},
	ignorePatterns: [
		// Ignore dotfiles
		'.*.{js,cjs}',
		'node_modules/',
		'dist/',
	],
	overrides: [
		// TypeScript
		{
			files: ['**/*.{ts,tsx}'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				project: true,
			},
			rules: {
                // these rules are copied from WCI
				'@typescript-eslint/explicit-function-return-type': 'warn',
				'@typescript-eslint/ban-ts-comment': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_',
					},
				],
				'@typescript-eslint/no-explicit-any': 'warn',
				'prefer-const': 'warn',
				'@typescript-eslint/strict-boolean-expressions': 'error',
				'@typescript-eslint/naming-convention': [
					'error',
					// enforce that all function names are in camelCase
					{
						selector: ['function'],
						format: ['camelCase'],
					},
				],
				'no-shadow': 'off',
				'@typescript-eslint/no-shadow': 'error',
				'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			},
		},

		// Node
		{
			files: ['.eslintrc.cjs'],
			env: {
				node: true,
			},
		},
	],
}