import Conf from 'conf'

/**
 * Creates a caching mechanism for storing and retrieving values.
 * @param   {object} params             - Parameters for configuring the cache.
 * @param   {string} params.id          - Unique identifier for the cache.
 * @param   {object} params.values      - Initial values to cache.
 * @param   {string} params.projectName - Name of the project to use for configuration.
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
export const cache = async <K extends string>( {
	id,
	values,
	projectName,
}: {
	/**
	 * Project name for search cache.
	 */
	projectName : string
	/**
	 * Identifier for the values.
	 */
	id          : string
	/**
	 * Cache Values.
	 */
	values      : Record<K, unknown>
} ) => {

	type Values = Record<K, unknown>
	type Value = Values[keyof Values]
	const config = new Conf( { projectName } )

	return {
		values,
		get : ( v?: K ): Value | Values => {

			const c = ( config.get( id ) || {} ) as Values
			if ( !v ) return c
			if ( c && typeof c === 'object' && v in c ) return c[v]
			if ( typeof values === 'object' && v in values ) return values[v]
			throw new Error( `Cache value is unexpected: ${v}` )

		},
		set : ( obj: Values ) => {

			const currentConfig = config.get( id ) || {}
			const updatedConfig = {
				...currentConfig,
				...obj,
			}
			config.set( id, updatedConfig )

		},
	}

}

