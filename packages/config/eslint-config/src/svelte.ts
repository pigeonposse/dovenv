import ts from 'typescript-eslint'

import { FILES } from './const'

import type { Config } from './_types'

export type SvelteParams = {
	/**
	 * Svelte config file params.
	 */
	svelteConfig : Record<string, unknown>
	/**
	 * Additional rules for .svelte files.
	 */
	rules        : Config['rules']
	/**
	 * Enable typescript support.
	 *
	 * @default false
	 */
	ts           : NonNullable<Config['languageOptions']>['parserOptions'] | boolean
}

const getEslintPlugin = async (): Promise<typeof import( 'eslint-plugin-svelte' ).default | undefined> => {

	try {

		const { default: eslintPluginSvelte } = await import( 'eslint-plugin-svelte' )
		return eslintPluginSvelte

	}
	catch ( e ) {

		console.warn( '[setSvelteConfig] Failed to import eslint-plugin-svelte', e )
		return undefined

	}

}
/**
 * SET SVELTE ESLINT CONFIG.
 *
 * Creates a config for svelte.
 *
 * @param   {Partial<SvelteParams>} params - Parameters.
 * @returns {Config[]}                     A list of configurations.
 * @see https://sveltejs.github.io/eslint-plugin-svelte/
 */
export const setSvelteConfig = async ( params?: Partial<SvelteParams> ): Promise<Config[]> => {

	const eslintPluginSvelte = await getEslintPlugin()
	if ( !eslintPluginSvelte ) return []

	return [
		...eslintPluginSvelte.configs.recommended.map( d => {

			if ( d.rules ) return {
				...d,
				files : [ FILES.SVELTE ],
			}
			return d

		} ),
		{
			files           : [ FILES.SVELTE, FILES.SVELTE_FILE ],
			languageOptions : { parserOptions : {
				...( params?.ts
					? {
						projectService      : true,
						extraFileExtensions : [ '.svelte' ], // Add support for additional file extensions, such as .svelte
						parser              : ts.parser,
						...( typeof params.ts === 'boolean' ? {} : params.ts ),
					}
					: {}
				),
				svelteConfig : params?.svelteConfig,
			} },
		},
		{
			files : [ FILES.SVELTE ],
			rules : {
				'align-import/align-import'            : 'off',
				'align-import/trim-import'             : 'off',
				'no-undef'                             : 'off',
				'one-var'                              : 'off',
				'svelte/require-each-key'              : 'off',
				'svelte/sort-attributes'               : 'error',
				'svelte/max-attributes-per-line'       : 'error',
				'svelte/mustache-spacing'              : 'error',
				'svelte/first-attribute-linebreak'     : 'error',
				'svelte/html-closing-bracket-spacing'  : 'error',
				'svelte/html-closing-bracket-new-line' : 'error',
				'svelte/button-has-type'               : [
					'error',
					{
						button : true,
						submit : true,
						reset  : true,
					},
				],
				'svelte/spaced-html-comment' : [ 'error', 'always' ],
				'svelte/indent'              : [
					'error',
					{
						indent                    : 'tab',
						ignoredNodes              : [],
						switchCase                : 1,
						alignAttributesVertically : false,
					},
				],
				'prefer-const'           : 'off',
				'svelte/no-at-html-tags' : 'off',
				'import/order'           : [
					'error',
					{
						'groups' : [
						// Native modules (builtin) and externals
							[ 'builtin', 'external' ],
							// Internal
							[
							// example: import api from "@/services/api"
								'internal',
								// example: import config from "../config"
								'parent',
								// example: import logger from "./logger"
								'sibling',
								// example: import main from "./"
								'index',
							],
							// Types
							[ 'type' ],
							// special object import. Not used
							[ 'object' ],
						],
						'pathGroups' : [
							{
								pattern  : '$*/**',
								group    : 'index',
								position : 'after',
							},
							{
								pattern  : '**/*.{css,sass,scss,postcss}',
								group    : 'internal',
								position : 'before',
							},
						],
						'named'       : true,
						'alphabetize' : {
							order           : 'asc',
							caseInsensitive : false,
						},
						'newlines-between'        : 'always',
						'warnOnUnassignedImports' : true,
						'distinctGroup'           : false,
					},
				],
				...( params?.rules || {} ),
			},
		},
		{
			files : [ FILES.SVELTE ],
			rules : { 'jsdoc/require-jsdoc': 'off' },
		},
	// {
	// 	files : [ FILES.JS ],
	// 	rules : { 'jsdoc/valid-types': 'off' },
	// },
	]

}
