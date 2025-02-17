import * as dovenv from '../dist/main.mjs'

// console.dir( dovenv.generalConfig, { depth: 4 } )

export default [ ...dovenv.config, { rules: { 'invented-rule': 'error' } } ]

