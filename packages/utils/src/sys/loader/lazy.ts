/* eslint-disable @stylistic/object-curly-newline */

type LazyLoaderOptions = {
	/**
	 * Option to enable debug logging for loading time
	 */
	debug? : boolean
}

export class LazyLoader<O extends Record<string, () => Promise<unknown>>> {

	// Cache to store loaded resources
	#cache : Map<keyof O, Awaited<ReturnType<O[keyof O]>>> = new Map()

	// Options for the lazy loader, passed through the constructor
	options : LazyLoaderOptions

	// Constructor accepts a map of resource keys, load functions, and options
	constructor( private resources: O, options: LazyLoaderOptions = {} ) {

		this.options = options

	}

	#setTimer( key: keyof O ) {

		if ( !this.options.debug ) return { stop: () => {} }
		const startTime = performance.now()
		return {
			stop : () => {

				const endTime = performance.now()
				console.log( `Resource ${String( key )} loaded in ${( endTime - startTime ).toFixed( 2 )}ms` )

			},
		}

	}

	/**
	 * Retrieves a resource by its key, loading it if necessary and caching the result.
	 *
	 * @param   {keyof O}                            key - The key of the resource to load.
	 * @returns {Promise<Awaited<ReturnType<O[K]>>>}     The loaded resource.
	 */
	async get<K extends keyof O>( key: K ): Promise<Awaited<ReturnType<O[K]>>> {

		const timer = this.#setTimer( key )
		// If the resource is already in the cache, return it
		if ( this.#cache.has( key ) ) {

			const res = this.#cache.get( key )!
			timer.stop()
			return res

		}

		// Retrieve the load function associated with the resource key
		const loadFn = this.resources[key]
		if ( !loadFn ) throw new Error( `No load function found for ${key.toString()}` )

		// Optionally, start the timer to measure loading time if debug is enabled

		try {

			// Load the resource
			const resource = await loadFn() as Awaited<ReturnType<O[K]>>

			// Store the loaded resource in the cache
			this.#cache.set( key, resource )

			timer.stop()
			// Return the loaded resource
			return resource

		}
		catch ( error ) {

			console.error( `Error loading resource ${key.toString()}:`, error )
			throw error

		}

	}

}
