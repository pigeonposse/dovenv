/* eslint-disable @stylistic/object-curly-newline */
import type {
	CommandUtils,
} from '@dovenv/core'
import type {
	PackageJSON,
	Prettify,
	setDirTree,
	Validate,
	ValidateAnyType,
} from '@dovenv/core/utils'

type CheckOpts = {
	/**
	 * Directory to check.
	 */
	dir     : string
	/**
	 * Path to package.json.
	 */
	path    : string
	/**
	 * Object data from package.json.
	 */
	content : PackageJSON
	/** Dovenv configuration */
	utils   : CommandUtils
}
type PatternCheck = string[] |
	( ( opts: CheckOpts ) => Promise<string[] | undefined> | ( string[] | undefined ) )

type Sharedcheck = {
	desc?    : string
	/**
	 * Files that must exist.
	 */
	include? : PatternCheck
	/**
	 * Files that must not exist.
	 */
	exclude? : PatternCheck
	/**
	 * Custom check function.
	 */
	custom?  : ( opts: CheckOpts ) => Promise<void>
}

export type Config = {
	/**
	 * Information for the workspace.
	 */
	info? : {
		/**
		 * Instructions for the workspace.
		 * Must be markdown format.
		 * Accepts string, URL or path.
		 *
		 * @example
		 * ```markdown
		 * ## Pre-requisites
		 * project needs the following tools to work:
		 * - `node` > 20 installed
		 * - `pnpm` > 9 installed
		 * - `gh` > 2 installed
		 * - `git` > 2 installed
		 * ## Init workspace
		 * pnpm install
		 * ```
		 */
		instructions? : string
		/**
		 * Add more commands to the list of useful commands.
		 *
		 * @example
		 * usefullCmds : [
		 * 	{
		 * 		desc  : 'Checks for outdated packages.',
		 * 		cmd   : 'pnpm -r outdated',
		 * 	},
		 * ]
		 */
		usefulCmds? : {
			desc  : string
			cmd   : string
			/**
			 * URL to more info.
			 */
			info? : string
		}[]
		/**
		 * Structure of the workspace.
		 */
		structure? : Parameters<typeof setDirTree>[0]['structure']

	}
	check?: {
		/**
		 * Checks for workspace package(s).
		 */
		pkg?: Record<
			string,
			Prettify<Sharedcheck & {
			/**
			 * Schema for own package.json.
			 *
			 * @example
			 * const schema = ({v, path, data}) => {
			 *  if(data.private) return
			 *  return v.object({
			 *    name: v.string(),
			 *    version: v.string(),
			 *    description: v.string(),
			 *  })
			 * }
			 */
				schema? : ( opts: {
				/**
				 * Validation (Zod wrapper).
				 */
					v       : Validate
					/**
					 * Path to package.json.
					 */
					path    : string
					/**
					 * Object data from package.json.
					 */
					content : PackageJSON
					/** Dovenv utilities */
					utils   : CommandUtils
				} )=> Promise<ValidateAnyType | void> | ( ValidateAnyType | void )
			}>
		>
	}
	/** List of commands for run */
	// exec? : {
	// 	/** Package name */
	// 	[key in string]: {
	// 		/** Describe the command */
	// 		desc : string
	// 	}
	// }
	/** Reinstall the workspace options */
	reinstall? : {
		hook?: {
			/** Hook before reinstallation */
			before? : ( ) => Promise<void>
			/** Hook after reinstallation */
			after?  : ( ) => Promise<void>
		}
	}
	/** Custom configration for ws */
	custom? : NonNullable<CommandUtils['config']>['custom']
}

