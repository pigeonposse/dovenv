import { Response } from '../../_shared/types'
import { Command }  from '../_shared/main'

import type { exec } from '@dovenv/utils'

export type AliasesConfig = {
	[key in string]: {
		/** description of your alias */
		desc : string
		/**
		 * command of your alias.
		 * @example
		 * {
		 *   cmd : 'dovenv check'
		 * }
		 * @example
		 * {
		 *   cmd : async () => { console.log( 'Hello World' ) }
		 * }
		 * @example
		 * {
		 *   cmd : async ({exec}) => await exec.command('node ./src/bin.js')
		 * }
		 * @example
		 * {
		 *   cmd : async ({exec}) => await exec.runtime('./src/bin.js')
		 * }
		 */
		cmd  : string | ( ( params: {
			/** Dovenv Configuration */
			utils : Command['utils']
			/** Options passed affter cmd */
			opts  : string[] | undefined
			/** Execute functions */
			exec: {
				/**
				 * Executes a given command in the shell.
				 * @param {string} command - The command to be executed.
				 * @returns {Promise<string>} - Resolves with the output of the command.
				 * @example
				 * command('ls -la')
				 */
				command : typeof exec

				/**
				 * Executes a command in the shell based in your current JS runtime.
				 * @param {string} runtime - The runtime (e.g., `node`) to use for execution.
				 * @returns {Promise<string>} - Resolves with the runtime execution result.
				 * @example
				 * runtime('./src/bin.js')
				 */
				runtime : typeof exec

				/**
				 * Executes a command in the shell based in your current JS manager.
				 * @param {string} pkgManager - The package manager (e.g., `npm`, `yarn`, `pnpm`) to use for execution.
				 * @returns {Promise<string>} - Resolves with the output of the package manager command.
				 */
				pkgManager : typeof exec

				/**
				 * Executes dovenv command in shell.
				 * @param {string} cmd - The command to execute.
				 * @returns {Promise<string>} - Resolves with the binary execution output.
				 * @example
				 * current('alias') // Return the dovenv aliases
				 */
				current : typeof exec

				/**
				 * Executes a command related to a package's binary.
				 * @type {Command['utils']['execPkgBin']}
				 */
				pkgBin : Command['utils']['execPkgBin']
			}
			/** workspace data to be used */
			data: {
				/**
				 * The runtime to be used (e.g., `node`).
				 */
				runtime        : string
				/**
				 * The package manager to be used (e.g., `npm`, `yarn`, `pnpm`).
				 */
				pkgManager     : string
				/**
				 * Some package manager commands.
				 */
				pkgManagerCmds : ReturnType<Command['utils']['getPkgManagerCmds']>
				/**
				 * Workspace is a monorepo?.
				 */
				isMonorepo     : boolean
				/**
				 * The binary to be executed (e.g., `eslint`, `vite`).
				 */
				bin            : string
			}
		} ) => Response<void> )
	}
}
