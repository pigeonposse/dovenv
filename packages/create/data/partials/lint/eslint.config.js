import * as dovenv from '@dovenv/lint'

// console.dir( dovenv.generalConfig, { depth: 4 } )
export default [ dovenv.includeGitIgnore(), ...dovenv.config ]
