import yargs       from 'yargs'
import { hideBin } from 'yargs/helpers'

import type { Argv } from 'yargs'

/**
 * Create a cli interface.
 * @param   {{argv: string[], fn: (cli: Argv) => Promise<Argv>}} options - Options object with argv and a function to setup the cli.
 * @returns {Promise<Argv>}                                                  - Resolves with the cli interface.
 * @example
 *
 * const cli = await createCli({
 *   argv : process.argv,
 *   fn   : async cli => {
 *
 *     cli.command( 'build', 'Run the build process', async () => {
 *
 *       console.log( 'build' )
 *
 *     } ).command( 'dev', 'Run the dev server', async () => {
 *
 *       console.log( 'dev' )
 *
 *     } ).command( 'preview', 'Run the preview server', async () => {
 *
 *       console.log( 'preview' )
 *
 *     } ).demandCommand( 1, 'You need to specify a command (build, dev, or preview)' )
 *
 *     return cli
 *
 *   },
 * } )
 */
export const createCli = async ( {
	argv = process.argv, fn,
}: {
	argv : string[]
	fn   : <Cli extends Argv>( cli: Cli ) => Promise<Cli>
} ) => {

	const bin = yargs( hideBin( argv ) )

	await fn( bin )

	bin.help()
	bin.parse()
	return bin

}

