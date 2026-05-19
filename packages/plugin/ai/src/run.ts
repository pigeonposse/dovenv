
import type {
	EnvAI,
	Config,
} from '@env-ai/core'

let ENVAI: typeof EnvAI | undefined = undefined
export const run = async ( config: Config ) => {

	if ( !ENVAI ) ENVAI = ( await import( '@env-ai/core' ) ).EnvAI
	// @ts-ignore
	const cli          = new ENVAI( config )
	cli.message.intro  = 'dovenv assistant'
	cli.message.outro  = 'dovenv assistant completed!'
	cli.message.cancel = 'dovenv assistant cancelled!'
	await cli.run( )

}
