
import { MultipleConvert } from './run'

import type { Config }                 from './run'
import type { Config as DovenvConfig } from '@dovenv/core'

export * from './run'

/**
 * A plugin for `dovenv` to convert files from one format to another.
 * @param {Config} [conf] - Configuration for the plugin.
 * @returns {DovenvConfig} - The plugin.
 * @example
 * import { defineConfig } from '@dovenv/core'
 * import { convertPlugin } from '@dovenv/convert'
 * export default defineConfig(
 *     convertPlugin( {
 *       exampleJSDOC: {
 *         type: 'jsdoc2md',
 *         input: 'examples/recourses/main.js',
 *         output: 'build/jsdoc',
 *       },
 *       exampleTS: {
 *         type: 'ts2md',
 *         input: 'examples/recourses/main.ts',
 *         output: 'build/ts',
 *       },
 *       exampleHTML: {
 *         type: 'md2html',
 *         input: 'https://raw.githubusercontent.com/pigeonposse/backan/refs/heads/main/README.md',
 *         output: 'build/html',
 *       },
 *     } ),
 * )
 */
export const convertPlugin = ( conf?: Config ): DovenvConfig => {

	return { custom : { convert : {
		desc : 'Convert files from one format to another (experimental)',
		opts : { key : {
			alias : 'k',
			desc  : 'Key pattern to convert',
			type  : 'array',
		} },
		fn : async values => {

			const convert = new MultipleConvert( conf, values.config )
			await convert.run( values.opts?.key as string[] )

		},
	} } }

}

export default convertPlugin
