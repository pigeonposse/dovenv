import css                from '@eslint/css'
import { tailwindSyntax } from '@eslint/css/syntax'

import { FILES } from './const'

import type {
	Config,
	ConfigParamsSuper,
} from './_types'

type CssRuleKey = keyof typeof css.configs.recommended['rules']

export type CssConfigParams = ConfigParamsSuper & {
	/**
	 * Support for Tailwind CSS.
	 *
	 * @default false
	 */
	tailwind? : boolean
	/**
	 * Support for PostCSS.
	 *
	 * @default false
	 */
	postcss?  : boolean
	/**
	 * Custom rules.
	 */
	rules?    : Record<CssRuleKey, string>
}

/**
 * Generates a CSS ESLint config based on the given parameters.
 *
 * @param   {CssConfigParams} [params] - Parameters to generate the config.
 * @returns {Config[]}                 - The generated CSS ESLint config.
 * @example
 * // Generates a basic CSS ESLint config.
 * const config = setCssConfig()
 *
 * // Generates a CSS ESLint config with tailwind syntax.
 * const config = setCssConfig({ tailwind: true })
 *
 * // Generates a CSS ESLint config with postcss syntax.
 * const config = setCssConfig({ postcss: true })
 *
 * // Generates a CSS ESLint config with custom rules.
 * const config = setCssConfig({
 *   rules: {
 *   },
 * })
 */
export const setCssConfig = ( params?: CssConfigParams ): Config[] => [
	{
		files    : [ FILES.CSS ],
		language : 'css/css',
		plugins  : { css },
		...( params?.tailwind || params?.postcss
			? { languageOptions : {
				...( params?.tailwind ? { customSyntax: tailwindSyntax } : {} ),
				...( params?.postcss ? { tolerant: true } : {} ),
			} }
			: {}
		),
		rules : {
			...css.configs.recommended.rules,
			...( params?.rules ? params.rules : {} ) as Config['rules'],
		},
	},
]

/**
 * CSS Eslint config.
 *
 * @see https://github.com/eslint/css
 */
export const cssConfig = setCssConfig( {
	postcss  : true,
	tailwind : true,
} )

