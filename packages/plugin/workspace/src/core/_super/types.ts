/* eslint-disable @stylistic/object-curly-newline */
import type {
	PackageJSON,
	Prettify,
	Validate,
	ValidateAnyType,
} from '@dovenv/utils'

type CheckOpts = {
	/**
	 * Directory to check
	 */
	dir     : string
	/**
	 * Path to package.json
	 */
	path    : string
	/**
	 * Object data from package.json
	 */
	content : PackageJSON
}
type PatternCheck = string[] |
	( ( opts: CheckOpts ) => Promise<string[] | undefined> | ( string[] | undefined ) )

type Sharedcheck = {
	/**
	 * Files that must exist
	 */
	include? : PatternCheck
	/**
	 * Files that must not exist
	 */
	exclude? : PatternCheck
	/**
	 * Custom check function
	 */
	custom?  : ( opts: CheckOpts ) => Promise<void>
}
export type Config = {
	/**
	 * Information for the workspace
	 */
	info? : {
		/**
		 * Instructions for the workspace.
		 * Must be markdown format.
		 * Accepts string, URL or path
		 * @example ```markdown
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
		 * Add more commands to the list of useful commands
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
			 * URL to more info
			 */
			info? : string
		}[]
		/**
		 * Structure of the workspace
		 */
		structure? : object

	}
	check?: {
		/**
		 * Checks for packages
		 */
		pkg?: Prettify< Sharedcheck & {
			/**
			 * Schema for own package.json
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
				 * Validation (Zod wrapper)
				 */
				v       : Validate
				/**
				 * Path to package.json
				 */
				path    : string
				/**
				 * Object data from package.json
				 */
				content : PackageJSON
			} )=> Promise<ValidateAnyType | void> | ( ValidateAnyType | void )
		}>
	}
	/** List of commands for run */
	exec? : {
		/** Package name */
		[key in string]: {
			/** Describe the command */
			desc : string
		}
	}
	/** Reinstall the workspace options */
	reinstall? : {
		hook?: {
			/** Hook before reinstallation */
			before? : ( ) => Promise<void>
			/** Hook after reinstallation */
			after?  : ( ) => Promise<void>
		}
	}
}
export type ConstructorParams = {
	config? : Config
	consts? : Record<string, unknown>
}
