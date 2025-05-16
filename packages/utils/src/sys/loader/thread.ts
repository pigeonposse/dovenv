// import {
// 	Worker,
// 	isMainThread,
// 	parentPort,
// } from 'node:worker_threads'

// type LoadFunction<T> = () => Promise<T>

// interface ThreadLoaderOptions {
// 	debug?     : boolean // Option to enable debug logging for loading time
// 	useWorker? : boolean // Option to use Worker for loading resources
// }

// export class ThreadLoader<T> {

// 	private cache   : Map<string, T> = new Map()
// 	private options : ThreadLoaderOptions

// 	constructor( private resources: Record<string, LoadFunction<T>>, options: ThreadLoaderOptions = {} ) {

// 		this.options = options

// 	}

// 	/**
// 	 * Retrieves a resource by its key, loading it if necessary and caching the result.
// 	 * Optionally, offload the loading task to a Worker if specified in the options.
// 	 *
// 	 * @param   {string} key - The key of the resource to load.
// 	 * @returns {T}          The loaded resource.
// 	 */
// 	async get<K extends keyof typeof this.resources>( key: K ): Promise<T> {

// 		// If the resource is already in the cache, return it
// 		if ( this.cache.has( key as string ) ) {

// 			return this.cache.get( key as string )!

// 		}

// 		const loadFn = this.resources[key]
// 		if ( !loadFn ) throw new Error( `No load function found for ${key}` )

// 		// Optionally, start the timer to measure loading time if debug is enabled
// 		const startTime = this.options.debug ? performance.now() : 0

// 		// If Worker is enabled, offload the loading task to a worker
// 		if ( this.options.useWorker ) {

// 			return this.loadWithWorker( loadFn, key, startTime )

// 		}

// 		try {

// 			// Load the resource normally (without worker)
// 			const resource = await loadFn()
// 			this.cache.set( key as string, resource )

// 			// If debug is enabled, log the loading time
// 			if ( this.options.debug ) {

// 				const endTime = performance.now()
// 				console.log( `Resource ${key} loaded in ${( endTime - startTime ).toFixed( 2 )}ms` )

// 			}

// 			return resource

// 		}
// 		catch ( error ) {

// 			console.error( `Error loading resource ${key}:`, error )
// 			throw error

// 		}

// 	}

// 	private async loadWithWorker(
// 		loadFn: LoadFunction<T>,
// 		key: string,
// 		startTime: number,
// 	): Promise<T> {

// 		return new Promise<T>( ( resolve, reject ) => {

// 			// Create a new Worker thread
// 			const worker = new Worker( __filename, { workerData : {
// 				loadFn : loadFn.toString(),
// 				key,
// 			} } )

// 			// Handle messages received from the worker
// 			worker.on( 'message', message => {

// 				const {
// 					resource, error, success,
// 				} = message

// 				if ( success ) {

// 					this.cache.set( key, resource )

// 					// If debug is enabled, log the loading time
// 					if ( this.options.debug ) {

// 						const endTime = performance.now()
// 						console.log( `Resource ${key} loaded in ${( endTime - startTime ).toFixed( 2 )}ms` )

// 					}

// 					resolve( resource )

// 				}
// 				else {

// 					reject( new Error( `Error loading resource ${key}: ${error}` ) )

// 				}

// 				worker.terminate()

// 			} )

// 			worker.on( 'error', err => {

// 				reject( err )
// 				worker.terminate()

// 			} )

// 			worker.on( 'exit', code => {

// 				if ( code !== 0 ) {

// 					reject( new Error( `Worker stopped with exit code ${code}` ) )

// 				}

// 			} )

// 		} )

// 	}

// }

