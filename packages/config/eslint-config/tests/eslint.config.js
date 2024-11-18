import * as dovenv  from '../dist/main.mjs'
import svelteConfig from '../dist/svelte.mjs'
// console.dir( dovenv.generalConfig, { depth: 4 } )
export default [ ...dovenv.config, ...svelteConfig ]
