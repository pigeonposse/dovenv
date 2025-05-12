import yargs                       from 'yargs'
import { hideBin as hideBinYargs } from 'yargs/helpers'

export * from './flag'

import type { Argv } from 'yargs'

/**
 * Hides the first two arguments from the process.argv array.
 *
 * @returns {string[]} Array of arguments without the first two elements.
 * @example
 * import { hideBin } from '@dovenv/utils'
 * const args = hideBin( process.argv ) // removes the uneeded arguments
 * console.log( args )
 */
export const hideBin = hideBinYargs

/**
 * Create a cli interface.
 *
 * @param   {{argv: string[], fn: (cli: Argv) => Promise<Argv>}} options - Options object with argv and a function to setup the cli.
 * @returns {Promise<Argv>}                                              - Resolves with the cli interface.
 * @example
 * import { createCli, hideBin } from '@dovenv/utils'
 * const args = hideBin( process.argv ) // removes the uneeded arguments
 * const cli = await createCli({
 *   args : args,
 *   fn   : async cli => {
 *
 *     cli.command( 'build', 'Run the build process', async () => {
 *       // ...
 *     } ).command( 'dev', 'Run the dev server', async () => {
 *       // ...
 *     } ).command( 'preview', 'Run the preview server', async () => {
 *       // ...
 *     } ).demandCommand( 1, 'You need to specify a command (build, dev, or preview)' )
 *
 *     return cli
 *
 *   },
 * } )
 */
export const createCli = async ( {
	args = process.argv,
	fn,
}: {
	args : string[]
	fn   : <Cli extends Argv>( cli: Cli ) => Promise<Cli>
} ) => {

	const bin = yargs( args )

	await fn( bin )

	bin.help()
	bin.parse()
	return bin

}

