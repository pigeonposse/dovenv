import {
	deepmergeCustom,
	deepmerge,
} from 'deepmerge-ts'

export {
	deepmerge,
	deepmergeCustom,
}

/**
 * Creates a function to merge multiple configuration objects into a single configuration.
 *
 * @template Config - The type of the configuration objects.
 * @param   {object}   [opts] - Optional merge options for `deepmergeCustom`.
 * @returns {Function}        A function that accepts multiple configuration objects or arrays of configuration objects
 *                            and returns a single merged configuration object.
 * @example
 * const mergeConfig = createMergeDataFn<{ foo: string; bar: string }>()
 * const config1 = { foo: 'bar' }
 * const config2 = { bar: 'foo' }
 * const merged = mergeConfig( config1, config2 )
 * // or
 * const merged = mergeConfig( [ config1, config2 ] )
 * console.log( merged )
 */
export const createMergeDataFn = <Config> ( opts?: Parameters<typeof deepmergeCustom<Config>>[0] ) => ( ...config: ( Config | Config[] )[] ) => {

	const mergeConfig = ( ...configs: Config[] ): Config =>
		deepmergeCustom<Config>( opts || {} )( ...configs ) as Config
	if ( config.length === 1 ) {

		const [ single ] = config

		if ( Array.isArray( single ) )
			return mergeConfig( ...single )

		return single

	}

	return mergeConfig( ...( config as Config[] ) )

}

