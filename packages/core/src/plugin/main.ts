// import { promptLineProps } from '@dovenv/utils'

// import { CommandStyle } from '../_shared/style'

// import type { Config } from '../types'

// export const createPlugin = <Opts = unknown>( config?:Config ) => {

// 	return  ( opts?:Opts ) => {

// 		const p = new Plugin( opts, config )

// 		return p.run()

// 	}

// }

// // const plugin = createPlugin< { t: true }>( () => {

// // 	return {}

// // } )
// // plugin( { t: true } )

// export class Plugin<PluginConfig = unknown>  {

// 	constructor(
// 		public props: PluginConfig,
// 		public config?: Config,
// 	) {}

// 	protected _style = new CommandStyle()
// 	protected _prompt = promptLineProps

// 	async run( ): Promise<Config> {

// 		return this.config || {}

// 	}

// }

// export class PluginTest extends Plugin {}
