import { createCli } from './cli'

await createCli( {
	argv : process.argv,
	fn   : async bin => {

		bin.command( 'build', 'Run the build process', async () => {

			console.log( 'build' )

		} ).command( 'dev', 'Run the dev server', async () => {

			console.log( 'dev' )

		} ).command( 'preview', 'Run the preview server', async () => {

			console.log( 'preview' )

		} ).demandCommand( 1, 'You need to specify a command (build, dev, or preview)' )

		return bin

	},
} )
