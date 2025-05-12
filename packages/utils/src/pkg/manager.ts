import { PKG_MANAGER } from './consts'
import {
	getPackage,
	getPackageFromName,
	getPackageFromPath,
	getPackageFromUrl,
} from './core'
import {
	PackageContent,
	PackageInput,
	PackageManager,
	PackageManagerCmds,
	PackageManagerCmdsValue,
	PackageName,
	PackagePath,
	PackageURL,
} from './types'

export type { PackageManagerData }
class PackageManagerData {

	#pkg

	/**
	 * Default package manager
	 */
	default = PKG_MANAGER.NPM

	#getPkgManager( name?: string ) {

		if ( name?.includes( PKG_MANAGER.PNPM ) ) return PKG_MANAGER.PNPM
		if ( name?.includes( PKG_MANAGER.YARN ) ) return PKG_MANAGER.YARN
		if ( name?.includes( PKG_MANAGER.BUN ) ) return PKG_MANAGER.BUN
		return undefined

	}

	constructor( { pkg }:{ pkg: PackageContent } ) {

		this.#pkg = pkg

	}

	/**
	 * Retrieves the active package manager name.
	 *
	 * This method returns the package manager in the following order of precedence:
	 * - Development mode package manager, if specified.
	 * - Production mode package manager, if specified.
	 * - Default package manager.
	 *
	 * @returns {PackageManager} The name of the active package manager.
	 */

	get value(): PackageManager {

		return this.dev || this.prod || this.default

	}

	/**
	 * Gets the package manager name.
	 * Checks the "packageManager" property in the package.json.
	 *
	 * @returns {PackageManager} The package manager name.
	 */
	get prod(): PackageManager | undefined {

		return this.#getPkgManager( this.#pkg.packageManager )

	}

	/**
	 * Gets the package manager name in development mode.
	 *
	 * Checks the "devEngines.packageManager.name" property in the package.json.
	 *
	 * @returns {PackageManager | undefined} The package manager name.
	 */
	get dev(): PackageManager | undefined {

		return this.#getPkgManager( this.#pkg.devEngines?.packageManager?.name )

	}

	/**
	 * Retrieves the command mappings for the package manager in production mode.
	 *
	 * The returned object contains commands for various package management tasks,
	 * such as auditing, updating, installing, and executing packages, specifically
	 * configured for production environments.
	 *
	 * @returns {PackageManagerCmdsValue | undefined} An object containing package manager commands for production mode, or undefined if no package manager is found.
	 */
	get prodCmds(): PackageManagerCmdsValue | undefined {

		return this.prod ? getPackageManagerCommands( this.prod, !!this.#pkg.workspaces ) : undefined

	}

	/**
	 * Retrieves the command mappings for the package manager in development mode.
	 *
	 * The returned object contains commands for various package management tasks,
	 * such as auditing, updating, installing, and executing packages, specifically
	 * configured for development environments.
	 *
	 * @returns {PackageManagerCmdsValue | undefined} An object containing package manager commands for development mode, or undefined if no package manager is found.
	 */
	get devCmds(): PackageManagerCmdsValue | undefined {

		return this.dev ? getPackageManagerCommands( this.dev, !!this.#pkg.workspaces ) : undefined

	}

	/**
	 * Retrieves the command mappings for the package manager.
	 *
	 * The returned object contains commands for various package management tasks,
	 * such as auditing, updating, installing, and executing packages.
	 *
	 * @returns {PackageManagerCmdsValue} An object containing package manager commands.
	 */
	get cmds(): PackageManagerCmdsValue {

		return getPackageManagerCommands( this.value, !!this.#pkg.workspaces )

	}

}

export const getPackageManagerFromContent = ( input: PackageContent ) => {

	return new PackageManagerData( { pkg: input } )

}
export const getPackageManagerFromUrl = async ( input: PackageURL, opts?: { pkg?: Parameters<typeof getPackageFromUrl>[1] } ) => {

	const pkg = await getPackageFromUrl( input, opts?.pkg )
	return getPackageManagerFromContent( pkg )

}
export const getPackageManagerFromPath = async ( input: PackagePath ) => {

	const pkg = await getPackageFromPath( input )
	return getPackageManagerFromContent( pkg )

}
export const getPackageManagerFromName = async ( input: PackageName, opts?: { pkg?: Parameters<typeof getPackageFromName>[1] } ) => {

	const pkg = await getPackageFromName( input, opts?.pkg )

	return getPackageManagerFromContent( pkg )

}

export const getPackageManager = async ( input: PackageInput, opts?: { pkg?: Parameters<typeof getPackage>[1] } ) => {

	const pkg = await getPackage( input, opts?.pkg )
	return getPackageManagerFromContent( pkg )

}

const PKG_MANAGER_CMDS = {
	pnpm : {
		audit    : 'pnpm audit',
		auditFix : 'pnpm audit --fix',
		outdated : 'pnpm outdated',
		upDeps   : 'pmpn up',
		exec     : 'pnpx',
		install  : 'pnpm install',
	},
	npm : {
		audit    : 'npm audit',
		auditFix : 'npm audit fix',
		outdated : 'npm outdated',
		upDeps   : 'npm update',
		exec     : 'npx',
		install  : 'npm install',
	},
	yarn : {
		audit    : 'yarn audit',
		auditFix : 'yarn audit fix',
		outdated : 'yarn outdated',
		upDeps   : 'yarn upgrade',
		exec     : 'yarn dlx',
		install  : 'yarn install',
	},
	bun : {
		audit    : 'bun audit',
		auditFix : 'bun audit fix',
		outdated : 'bun outdated',
		upDeps   : 'bun update',
		exec     : 'bunx',
		install  : 'bun install',
	},
} as const satisfies PackageManagerCmds

const PKG_MANAGER_CMDS_MONOREPO = {
	...PKG_MANAGER_CMDS,
	pnpm : {
		...PKG_MANAGER_CMDS.pnpm,
		outdated : 'pnpm -r outdated',
		upDeps   : 'pnpm -r up',
	},
} as const satisfies PackageManagerCmds

/**
 * Retrieves the package manager commands for the given package manager and monorepo mode.
 *
 * @param   {PackageManager} manager  - The package manager.
 * @param   {boolean}        monoRepo - Whether the workspace is a monorepo.
 * @returns {object}                  The package manager commands.
 */
export const getPackageManagerCommands = ( manager: PackageManager, monoRepo: boolean ): PackageManagerCmds[keyof PackageManagerCmds] => {

	return ( monoRepo ? PKG_MANAGER_CMDS_MONOREPO : PKG_MANAGER_CMDS )[manager]

}
