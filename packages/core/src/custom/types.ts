/* eslint-disable @stylistic/object-curly-newline */

import type { CommandUtils } from '../_shared/cmd-utils'
import type {
	ArgvParsed,
	Response,
} from '../_shared/types'
import type { createCli } from '@dovenv/utils'

export type ShowHelpFn = ( loglevel?: string ) => void
export type Cli = Awaited<ReturnType<typeof createCli>>

type Opt = Parameters<Cli['option']>[0][number] & {
	/** Description of the option */
	desc : string
}

type Cmd = {
	/** Description of the command */
	desc  : string
	/** Options for the command if there are any */
	opts? : {
		/** Key of the option */
		[key in string]: Opt
	}
	/** Commands for the command if there are any */
	cmds?     : {
		/** Key of the command */
		[key in string]: Cmd
	}
	/** Examples of the command */
	examples? : {
		/** Description of the example */
		desc : string
		/** Command to use */
		cmd  : string
	}[]
}

type CommandFn = (
	data: ArgvParsed & {
		/** Print the usage data using the console function consoleLevel for printing. */
		showHelp : ShowHelpFn
		utils    : CommandUtils
	} ) => Response<void>

export type CustomConfig = {
	/** Key of the command */
	[key in string]: Cmd & {
		/** Function to run the command */
		fn        : CommandFn
		/** Settings for your custom command */
		settings?: {
			/**
			 * Wrap the console output with the app logger.
			 *
			 * @default true
			 */
			wrapConsole? : boolean
			/**
			 * Hide the command from the help menu.
			 *
			 * @default false
			 */
			hide?        : boolean
		}
	}
}

