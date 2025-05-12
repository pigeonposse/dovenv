import { RUNTIME }    from './consts'
import {
	getPackage,
	getPackageFromName,
	getPackageFromPath,
	getPackageFromUrl,
} from './core'
import {
	PackageContent,
	PackageName,
	PackagePath,
	PackageURL,
	Runtime,
} from './types'

export type { RuntimeData }
class RuntimeData {

	#pkg

	/**
	 * Default package Runtime
	 */
	default = RUNTIME.NODE

	constructor( { pkg }:{ pkg: PackageContent } ) {

		this.#pkg = pkg

	}

	#getRuntime( name?: string ) {

		if ( name?.includes( RUNTIME.BUN ) ) return RUNTIME.BUN
		if ( name?.includes( RUNTIME.DENO ) ) return RUNTIME.DENO
		if ( name?.includes( RUNTIME.NODE ) ) return RUNTIME.NODE
		return undefined

	}

	/**
	 * Gets the runtime of the current package.
	 *
	 * Checks the "engines.runtime.name" property in the package.json.
	 *
	 * @returns {Runtime} The runtime name.
	 */
	get value(): Runtime {

		return this.dev || this.prod || this.default

	}

	/**
	 * Gets the runtime of the current package in production mode.
	 *
	 * Checks the "engines" property in the package.json.
	 *
	 * @returns {Runtime | undefined} The runtime name.
	 */
	get prod(): Runtime | undefined {

		if ( !this.#pkg.engines ) return undefined
		for ( const key of Object.keys( this.#pkg.engines ) ) {

			const rt = this.#getRuntime( key )
			if ( rt ) return rt

		}
		return undefined

	}

	/**
	 * Gets the runtime of the current package in development mode.
	 *
	 * Checks the "devEngines.runtime.name" property in the package.json.
	 *
	 * @returns {Runtime | undefined} The runtime name.
	 */
	get dev(): Runtime | undefined {

		return this.#getRuntime( this.#pkg.devEngines?.runtime?.name ) || undefined

	}

}

export const getPackageRuntimeFromContent = ( input: PackageContent ) => {

	return new RuntimeData( { pkg: input } )

}

export const getPackageRuntimeFromUrl = async ( input: PackageURL, opts?: { pkg?: Parameters<typeof getPackageFromUrl>[1] } ) => {

	const pkg = await getPackageFromUrl( input, opts?.pkg )
	return getPackageRuntimeFromContent( pkg )

}
export const getPackageRuntimeFromPath = async ( input: PackagePath ) => {

	const pkg = await getPackageFromPath( input )
	return getPackageRuntimeFromContent( pkg )

}
export const getPackageRuntimeFromName = async ( input: PackageName, opts?: { pkg?: Parameters<typeof getPackageFromName>[1] } ) => {

	const pkg = await getPackageFromName( input, opts?.pkg )
	return getPackageRuntimeFromContent( pkg )

}

export const getPackageRuntime = async ( input: Parameters<typeof getPackage>[0], opts?: { pkg?: Parameters<typeof getPackage>[1] } ) => {

	if ( typeof input !== 'object' ) input = await getPackage( input, opts?.pkg )
	return getPackageRuntimeFromContent( input )

}
