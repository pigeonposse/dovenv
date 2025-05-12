/* eslint-disable @stylistic/object-curly-newline */
import {
	PKG_MANAGER,
	RUNTIME,
} from './consts'

import type { PackageJSON } from '@/ts'

export type WorkspaceParams = { pkg: PackageJSON }

export type PackageName = string
export type PackageURL = string | URL
export type PackagePath = string
export type PackageContent = PackageJSON
export type PackageInput = PackagePath | PackageURL | PackageName | PackageContent

export type PackageManager = typeof PKG_MANAGER[keyof typeof PKG_MANAGER]
export type Runtime = typeof RUNTIME[keyof typeof RUNTIME]

export type PackageOpts = { remote?: PackageRemoteOpts }
export type PackageRemoteOpts = {
	/**
	 * Package version
	 *
	 * @default 'latest'
	 */
	version   : number | string
	/**
	 * Registry to get package from
	 *
	 * @default 'https://registry.npmjs.org'
	 */
	registry? : string
}

export type PackageRepoUrlOpts = {
	/**
	 * Returns url with directory if has one.
	 *
	 * @default true
	 */
	dir : boolean
}
export type PackageManagerCmdsValue = {
	/** Audit package(s) */
	audit    : string
	/** Fix Audition package(s) */
	auditFix : string
	/** Checks for outdated packages */
	outdated : string
	/** Update dependencies */
	upDeps   : string
	/** Fetches a package from the registry without installing it as a dependency, hotloads it, and runs whatever default command binary it exposes. */
	exec     : string
	/** Install packages */
	install  : string
}
export type PackageManagerCmds = Record<PackageManager, PackageManagerCmdsValue>

export type PackageData = {
	/** name of the package or basename to package.json */
	id          : string
	/** Directory of package */
	dir         : string
	/** Path to package.json */
	packagePath : string
	/** Sanitized Repository URL */
	repoUrl?    : string
	/** Package.json content */
	content     : PackageContent
}

export type WorkspaceOpts = {
	/**
	 * Main package json
	 */
	pkg?   : PackageContent
	/**
	 * Workspace directory
	 *
	 * @default process.cwd()
	 */
	wsDir? : string
}
