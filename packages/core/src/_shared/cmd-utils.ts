
import {
	getObjectFromFile,
	joinPath,
	resolvePath,
	process,
} from '@dovenv/utils'

import { CommandSuper } from './cmd'

export type CommandUtils = CommandSuper

/**
 * Retrieves command utilities for the given workspace directory.
 * If a package.json object is not provided, it reads and parses it from the workspace directory.
 * @param {object} data - Data
 * @param {string} [data.wsDir] - The workspace directory path. Default: `process.cwd()`.
 * @param {Record<string, unknown>} [data.pkg] - Optional package.json content as an object.
 * @returns {Promise<CommandUtils>} - A promise that resolves to the command utilities.
 * @example
 * const utils = await getCommandUtils();
 * console.log(utils);
 */
export const getCommandUtils = async ( data?:{
	/**
	 * The workspace directory path.
	 * @default process.cwd()
	 */
	wsDir? : string
	/**
	 * Optional package.json content as an object.
	 */
	pkg?   : Record<string, unknown>
} ): Promise<CommandUtils> => {

	let { pkg } = data || {}

	const dir = data?.wsDir ? resolvePath( data.wsDir ) : process.cwd()
	if ( !pkg ) {

		const pkgDir = joinPath( dir, 'package.json' )
		pkg          = await getObjectFromFile<Record<string, unknown>>( pkgDir )

	}
	return new CommandSuper( { const : {
		wsDir : dir,
		pkg   : pkg,
	} } )

}
