import process from 'node:process'

import type {
	onStdOpts,
	ReplaceStdOpts,
	StdType,
} from './types'
import type { Any } from '../../ts/main'

/**
 * Replaces the output of `stdout` or `stderr` streams with a custom transformation function.
 * @param {onStdOpts} opts - Options for customizing the stream transformation.
 * @returns {object} A Object with `start` and `stop` methods.
 * @example
 * import { onStd } from '@dovenv/utils'
 * const secretOut = onStd({
 *   type : 'stdout',
 *   fn : ( { data } ) => data.replace( /secret/g, '***' ),,
 * });
 *
 * secretOut.start();
 * // my code
 * secretOut.stop();
 */
export const onStd = ( opts: onStdOpts ) => {

	const p = opts.process || process

	const types: StdType[] = Array.isArray( opts.type )
		? opts.type
		: [ opts.type || 'stdout' ]

	const originalWrites: Partial<Record<StdType, ( chunk: Any, ...args: Any[] ) => boolean>> = {}

	const intercept = ( type: StdType ) => {

		originalWrites[type] = p[type].write

		// Override the write method
		// @ts-ignore
		p[type].write = ( chunk, ...args ) => {

			const data = typeof chunk === 'string' ? chunk : chunk.toString()

			// Apply the transformation function
			const transformed = opts.fn( {
				data,
				type,
			} )

			// Write the transformed output
			return originalWrites[type]?.call( p[type], transformed, ...args )

		}

	}

	/**
	 * Enables the stream interception.
	 */
	const start = () => {

		types.forEach( intercept )

	}

	/**
	 * Restores the original write methods for the specified streams.
	 */
	const stop = () => {

		types.forEach( type => {

			if ( originalWrites[type] ) {

				p[type].write = originalWrites[type]!

			}

		} )

	}

	return {
		start,
		stop,
	}

}

/**
 * Replaces output in the specified stream (stdout, stderr, or stdin) by substituting
 * values based on the provided parameters.
 *
 * This function overrides the write method of the specified stream to replace occurrences
 * of specified strings in the output with replacement strings. It supports custom process
 * objects and stream types.
 *
 * ---
 * @param {ReplaceStdOpts} opts - The options for replacing output.
 * @param {ReplaceStdOpts['params']} opts.params - An object containing key-value pairs
 *                                               where each key is a string to be replaced by its corresponding value in the output.
 * @param {ReplaceStdOpts['proceso']} [opts.process] - An optional Node.js process object. Defaults to the global process.
 * @param {ReplaceStdOpts['type']} [opts.type] - The type of stream to replace output for. Defaults to 'stdout'.
 * @returns {object} A Object with `start` and `stop` methods.
 * @example
 * import { replaceConsole } from '@dovenv/utils'
 * const versionOut = replaceStd({
 *   params: {
 *     'v1.3.4': 'v2.1.9'
 *   },
 *   type: ['stderr']
 * });
 *
 * versionOut.start();
 * // my code
 * versionOut.stop();
 */
export const replaceStd = ( opts: ReplaceStdOpts ) => {

	return onStd( {
		process : opts.process,
		type    : opts.type,
		fn      : ( {
			data, type,
		} ) => {

			// Apply the optional transform function first
			let transformed = opts.transform
				? opts.transform( {
					data,
					type,
				} )
				: data

			// Apply replacements
			for ( const [ value, replaceValue ] of Object.entries( opts.params ) ) {

				transformed = transformed.replace( new RegExp( value, 'g' ), replaceValue )

			}

			return transformed

		},
	} )

}
