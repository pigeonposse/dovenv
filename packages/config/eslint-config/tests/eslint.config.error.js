import * as dovenv from '../dist/main.mjs'

export default [ ...dovenv.config, { rules: { 'invented-rule': 'error' } } ]

