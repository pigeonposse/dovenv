
import type {
	CLI,
	Config,
} from 'env-ai'

let ENVAI: typeof CLI | undefined = undefined
export const run = async ( config: Config ) => {

	if ( !ENVAI ) ENVAI = ( await import( 'env-ai' ) ).CLI
	// @ts-ignore
	const cli          = new ENVAI( {} )
	cli.message.intro  = 'dovenv assistant'
	cli.message.outro  = 'dovenv assistant completed!'
	cli.message.cancel = 'dovenv assistant cancelled!'
	await cli.fn( config )

}
