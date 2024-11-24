import type {
	ConsoleType,
	onConsoleOpts,
	ReplaceConsoleOpts,
} from './types'
import type { AnyArray } from '../../ts/main'

/**
 * Intercepts console methods and applies a transformation function to all arguments.
 *
 * Useful for replacing certain values in console output, such as API keys or other sensitive information.
 * @param {onConsoleOpts} opts - Options for the console interceptor.
 * @returns {object} A Object with `start` and `stop` methods.
 * @example
 * import { onConsole } from '@dovenv/utils'
 * const secretOut = onConsole({
 *   type : ['log', 'warn'],
 *   fn : ( { data } ) => data.replace( /secret/g, '***' ),,
 * });
 *
 * secretOut.start();
 * // my code
 * secretOut.stop();
 */
export const onConsole = ( opts: onConsoleOpts ) => {

	const types: ConsoleType[] = Array.isArray( opts.type )
		? opts.type
		: [ opts.type || 'log' ]

	const originalMethods: Partial<Record<ConsoleType, ( ...args: AnyArray ) => void>> = {}

	const intercept = ( type: ConsoleType ) => {

		originalMethods[type] = console[type]

		console[type] = ( ...args: AnyArray ) => {

			const transformedArgs = args.map( arg => {

				const data = typeof arg === 'string' ? arg : JSON.stringify( arg )
				return opts.fn( {
					data,
					type,
				} )

			} )

			// Call the original method with transformed arguments
			originalMethods[type]?.call( console, ...transformedArgs )

		}

	}

	/**
	 * Enables the console interceptor.
	 * This method iterates over the methods specified in the `type` option and overrides them with a version that applies the transformation function to all arguments.
	 */
	const start = () => {

		types.forEach( intercept )

	}
	/**
	 * Restores the original console methods that were previously overridden.
	 * This is used to stop the interception of console output.
	 */
	const stop = () => {

		types.forEach( type => {

			if ( originalMethods[type] )
				console[type] = originalMethods[type]!

		} )

	}

	return {
		start,
		stop,
	}

}

/**
 * Replaces values in console output using a set of parameters.
 * @param {ReplaceConsoleOpts} opts - Options for the console output replacer.
 * @returns {object} A Object with `start` and `stop` methods.
 * @example
 * import { replaceConsole } from '@dovenv/utils'
 * const versionOut = replaceConsole({
 *   params: {
 *     'v1.3.4': 'v2.1.9'
 *   },
 *   type: ['stderr']
 * });
 *
 * versionOut.start();
 * // mys code
 * versionOut.stop();
 */
export const replaceConsole = ( opts: ReplaceConsoleOpts ) => {

	return onConsole( {
		type : opts.type,
		fn   : ( {
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
