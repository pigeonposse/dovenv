import { PKG_MANAGER }                  from './consts'
import { getPackageDataFromPath }       from './core'
import { getPackageManagerFromContent } from './manager'
import { getPackageRuntimeFromContent } from './runtime'
import {
	PackageData,
	PackageManager,
	WorkspaceOpts,
} from './types'

import { getObjectFromYAMLFile } from '@/object'
import { process }               from '@/process/core'
import {
	existsPath,
	getDirName,
	getPaths,
	joinPath,
} from '@/sys'

const getWsDir = ( i?:string ) => i || getDirName( process.cwd() )

export const getPackageWorkspacePaths = async ( opts: Required<WorkspaceOpts> & { manager?: PackageManager } ) => {

	const {
		wsDir, pkg, manager,
	} = opts

	if ( manager && manager === PKG_MANAGER.PNPM ) {

		const monoPath = joinPath( wsDir, 'pnpm-workspace.yaml' )
		const exists   = await existsPath( monoPath )
		const packages = exists ? ( await getObjectFromYAMLFile<{ packages: string[] }>( monoPath ) ).packages : []
		packages.push( '.' )

		return await getPaths( packages.map( p => joinPath( wsDir, p, 'package.json' ) ) )

	}

	const wsData   = pkg.workspaces
	const packages = ( wsData && !Array.isArray( wsData )
		? wsData.packages
		: wsData ) || []

	packages.push( '.' )
	return await getPaths( packages.map( p => joinPath( wsDir, p, 'package.json' ) ) )

}

class WorkspaceData {

	#wsDir
	#pkg
	packageManager
	runtime

	constructor( opts?: WorkspaceOpts ) {

		if ( !opts?.pkg ) throw new Error( 'No package object found' )

		this.#wsDir         = getWsDir( opts?.wsDir )
		this.#pkg           = opts.pkg
		this.packageManager = getPackageManagerFromContent( this.#pkg )
		this.runtime        = getPackageRuntimeFromContent( this.#pkg )

	}

	/**
	 * Determines if the current package is part of a monorepo.
	 * Checks for the presence of the `workspaces` field in the package.json.
	 *
	 * @returns {boolean} True if the package is part of a monorepo, otherwise false.
	 */
	get monorepo(): boolean {

		return !!this.#pkg?.workspaces

	}

	#pkgPaths : string[] | undefined

	/**
	 * Gets the paths of the packages in the workspace.
	 * If the current package is part of a monorepo managed by pnpm, it reads the package paths from the "pnpm-workspace.yaml" file.
	 * Otherwise, it reads the package paths from the "workspaces" field in the package.json.
	 *
	 * @returns {Promise<string[]>} An array of paths to the package.json files of the packages in the workspace.
	 */
	async getPackagePaths( ) {

		if ( this.#pkgPaths ) return this.#pkgPaths

		this.#pkgPaths = await getPackageWorkspacePaths( {
			wsDir   : this.#wsDir,
			pkg     : this.#pkg,
			manager : this.packageManager.value,
		} )

		return this.#pkgPaths

	}

	#pkgData : PackageData[] | undefined

	/**
	 * Retrieves an array of package data objects containing the package name, path to the package.json file, and the package data itself.
	 *
	 * @returns {Promise<PackageData[]>} An array of package data objects.
	 */
	async getPackagesData(): Promise<PackageData[]> {

		if ( this.#pkgData ) return this.#pkgData

		const pkgPaths = await this.getPackagePaths()

		this.#pkgData = []

		for ( const pkgPath of pkgPaths ) {

			const pkgData = await getPackageDataFromPath( pkgPath )

			this.#pkgData.push( pkgData )

		}
		return this.#pkgData

	}

}

export const getWorkspaceUtils = ( opts?: WorkspaceOpts ) => {

	return new WorkspaceData( opts )

}

