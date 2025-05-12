/* eslint-disable camelcase */

import type { Config } from './_types'

/**
 * Enhances ESLint configuration performance by modifying file patterns
 * and rules based on specific conditions.
 *
 * @param   {Config[]} config - An array of ESLint configuration objects to be processed.
 * @returns {Config[]}        The modified configuration array.
 */
export const experimental__eslintEncreasePerformance = ( config: Config[] ): Config[] => {

	config.map( c => {

		if ( c.name === 'css:standard' ) return []
		if ( c.name === 'svelte:recommended:rules' ) c.files = [
			'**/*.js',
			'**/*.ts',
			'**/*.svelte',
			'*.svelte.js',
			'*.svelte.ts',
			'**/*.svelte.js',
			'**/*.svelte.ts',
		]
		const rules = c.rules ? Object.keys( c.rules ) : []
		if ( !rules || !rules.length ) return c

		if ( rules.filter( r => r === 'json-schema-validator/no-invalid' ).length )
			c.files = [ '**/*.json' ]
		if ( c.rules && rules.filter( r => r === '@typescript-eslint/no-unused-vars' ).length )
			c.rules['@typescript-eslint/no-unused-vars'] = 'off'
		if ( rules.filter( r => r.startsWith( '@typescript-eslint' ) ).length )
			c.files = [
				'**/*.ts',
				'**/*.tsx',
				'**/*.svelte',
				'**/*.svelte.ts',
			]
		if ( c.rules && rules.filter( r => r === 'svelte/no-unused-svelte-ignore' ).length ) {

			c.files                                   = [ '**/*.svelte' ]
			c.rules['svelte/no-unused-svelte-ignore'] = 'off'

		}
		if ( rules.filter( r => r === 'jsdoc/valid-types' ).length )
			c.files = [ '**/*.js', '**/*.ts' ]
		if ( rules.filter( r => r === 'vue/no-reserved-component-names' ).length )
			c.files = [ '**/*.vue' ]

		// if ( ( c.parser | c.parser?.startsWith( '@typescript-eslint' ) ) || rules.filter( r => r.startsWith( '@typescript-eslint' ) ).length ) {

		// 	// c.files.push( '**/*.svelte.ts' )
		// 	console.log( c )

		// }

		// if ( rules.filter( r => r === 'import/order' ).length )
		// 	console.dir( c )
		// if ( c.files?.filter( r => r.includes( 'svelte' ) ).length )
		// 	console.dir( c )
		return c

	} )

	// console.log( config )
	// config.push( {
	// 	files : [ '**/*.ts', '**/*.tsx' ],
	// 	rules : { '@typescript-eslint/no-unused-vars': 'warn' },
	// } )
	return config

}
