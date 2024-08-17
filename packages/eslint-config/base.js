import eslint from "@eslint/js";
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-config-turbo";

export default [
	eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	eslintConfigPrettier,
	// Turborepo hasn't implemented flat config support yet, but there's a (recent) PR and 
	// we can recreate flat config support from the existing turbo plugin. See more below:
	// https://github.com/vercel/turborepo/issues/7909#issuecomment-2276621193 and https://github.com/vercel/turborepo/pull/8606
	{
		name: 'eslint-config-turbo (recreated flat)',
		plugins: {
		  turbo: { rules: turboPlugin.rules },
		},
	},
	{
		// Ignore dotfiles, node_modules, build outputs
		ignores: [
			'.*.{js,cjs}',
			'node_modules/',
			'dist/',
		],
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		}
	}
]