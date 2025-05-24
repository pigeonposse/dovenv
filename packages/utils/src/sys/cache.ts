
import { deepmergeCustom } from 'deepmerge-ts'

import { getSystemEnvPaths } from './env-paths'
import {
	joinPath,
	ensureDir,
	existsFile,
	writeFile,
} from './super'

import { getObjectFromJSONFile } from '@/object'

type CacheOptions<Values extends Record<string, unknown>> = {
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
	/**
	 * Suffix for cache directory.
	 */
	suffix?     : string
}

/**
 * Creates a caching mechanism for storing and retrieving values.
 *
 * @param   {object} opts - Parameters for configuring the cache.
 * @returns {object}      - An object with methods to interact with the cache.
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
export const cache = async <Values extends Record<string, unknown>>( opts: CacheOptions<Values> ) => {

	const {
		id,
		values,
		projectName,
		cwd,
		suffix,
	} = opts

	type Config = { [id: string]: Partial<Values> }

	const dir = cwd || getSystemEnvPaths( {
		name : projectName,
		suffix,
	} ).config

	const configPath            = joinPath( dir, `config.json` )
	const defaultValues         = { [id]: values }
	const merge                 = deepmergeCustom<Config>( { mergeArrays: false } )
	const getCachedDataFromFile = async () => {

		try {

			const data = await getObjectFromJSONFile<Config>( configPath )
			return data

		}
		catch {

			return defaultValues

		}

	}
	const getCachedData = async () => {

		const exists = await existsFile( configPath )
		if ( !exists ) await ensureDir( dir )
		return exists ? await getCachedDataFromFile( ) : defaultValues

	}
	let cachedData = await getCachedData( )

	const set = async ( obj: Partial<Values> ) => {

		// Is necessary to read the file again to avoid race conditions
		const instantCachedData = await getCachedData( )
		// Merge the new values with the existing cached data
		const updatedData = merge( instantCachedData, { [id]: obj } ) as Config
		// Write the updated data to the cache file
		await writeFile( configPath, JSON.stringify( updatedData, null, 2 ) )

		cachedData = updatedData

	}

	const get = async <ID extends string | undefined = undefined>(
		v?: ID,
	): Promise<ID extends keyof Values ? Values[ID] : ID extends string ? undefined : Values> => {

		if ( typeof v === 'string' ) {

			// @ts-ignore
			if ( !cachedData[id] || typeof cachedData[id][v] === 'undefined' ) return undefined
			// @ts-ignore
			return cachedData[id][v] as Values[ID]

		}
		// @ts-ignore
		return cachedData[id] as Values

	}

	const reset = async () => await set( values )

	if ( !( await existsFile( configPath ) ) ) await set( values )

	else {

		const updatedData = merge( { [id]: values }, cachedData ) as Config
		await set( updatedData[id] )

	}

	return {
		/**
		 * The default values for the cache.
		 */
		defaultValues : values,
		/**
		 * Retrieve a value from the cache.
		 *
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
		 *
		 * @example
		 * reset();
		 */
		reset,
		/**
		 * The path to the cache file.
		 */
		path          : configPath,
	}

}
