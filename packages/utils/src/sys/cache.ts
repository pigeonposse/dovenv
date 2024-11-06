
import Conf                from 'conf'
import { deepmergeCustom } from 'deepmerge-ts'

/**
 * Creates a caching mechanism for storing and retrieving values.
 * @param   {object} params             - Parameters for configuring the cache.
 * @param   {string} params.id          - Unique identifier for the cache.
 * @param   {object} params.values      - Initial values to cache.
 * @param   {string} params.projectName - Name of the project to use for configuration.
 * @param {string } [params.cwd]        - The current working directory. Defaults to process.
 * @returns {object}                    - An object with methods to interact with the cache.
 * @throws {Error} If the cache value is unexpected or not found.
 * @example import { cache } from "@dovenv/utils"
 *
 * const { get, set } = await cache({
 *   projectName: 'myApp',
 *   id: 'userSettings',
 *   values: {
 *      theme: 'dark',
 *      language: 'en'
 *   },
 * });
 *
 * // Set a new value in the cache
 * set({ theme: 'light' });
 *
 * // Retrieve a value from the cache
 * const theme = get('theme');
 * console.log(theme); // Output: 'light'
 *
 * // Retrieve all cached values
 * const allValues = get();
 * console.log(allValues); // Output: { theme: 'light', language: 'en' }
 *
 * // Handle unexpected cache value
 * try {
 *   const nonExistentValue = get('nonExistent');
 * } catch (error) {
 *   console.error('Error:', error.message); // Output: Cache value is unexpected: nonExistent
 * }
 */
export const cache = async <Values extends Record<string, unknown>>( {
	id,
	values,
	projectName,
	cwd,
}: {
	/**
	 * Project name for search cache.
	 * You can reuse the same cache for multiple instances.
	 */
	projectName : string
	/**
	 * Identifier for the values.
	 */
	id          : string
	/**
	 * Cache Default Values.
	 */
	values      : Values
	/**
	 * Directory to save cache file.
	 * Default: System default user config directory.
	 * You most likely don't need this. Please don't use it unless you really have to.
	 */
	cwd?        : string
} ) => {

	const config = new Conf( {
		projectName,
		cwd,
	} )
	const merge  = deepmergeCustom( { mergeArrays: false } )

	const get = <ID extends ( ( keyof Values ) | undefined ) = undefined>( v?: ID ): ID extends ( keyof Values ) ? Values[ID] : Values => {

		const c = ( config.get( id ) || {} ) as Values
		// @ts-ignore
		if ( !v ) return c
		// @ts-ignore
		if ( v in c ) return c[v]
		// @ts-ignore
		if ( v in values ) return values[v]
		throw new Error( `Cache value is unexpected: ${v.toString()}` )

	}

	const set = ( obj: Partial<Values> ) => {

		const currentConfig = ( config.get( id ) || {} ) as Values

		const updatedConfig = merge(
			currentConfig,
			obj,
		)
		config.set( id, updatedConfig )

	}

	const reset = () =>
		config.reset( id )

	// set default values if not already set
	if ( !config.get( id ) ) set(  values )

	return {
		/**
		 * The default values for the cache.
		 */
		defaultValues : values,
		/**
		 * Retrieve a value from the cache.
		 * @example
		 * const theme = get('theme');
		 * console.log(theme); // Output: 'light'
		 */
		get,
		/**
		 * Updates the cache with the provided values.
		 *
		 * Merges the existing cached values with the new partial values and updates the cache.
		 */
		set,
		/**
		 * Resets the cache to its default values.
		 * @example
		 * reset();
		 */
		reset,
		/**
		 * The path to the cache file.
		 */
		path          : config.path,
	}

}
