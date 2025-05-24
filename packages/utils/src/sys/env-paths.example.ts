import { getSystemEnvPaths } from './env-paths'

const paths = getSystemEnvPaths( { name: 'dovenv' } )

console.log( paths )
