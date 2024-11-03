import { CLI } from 'env-ai'

import type { Config } from 'env-ai'

export const run = async ( config: Config ) => {

	// @ts-ignore
	const cli          = new CLI( {} )
	cli.message.intro  = 'dovenv assistant'
	cli.message.outro  = 'dovenv assistant completed!'
	cli.message.cancel = 'dovenv assistant cancelled!'
	await cli.fn( config )

}
