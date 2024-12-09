import * as dovenv from './packages/config/eslint-config/src/main.mjs'

// console.dir( dovenv.generalConfig, { depth: 4 } )
export default [
	dovenv.includeGitIgnore(),
	...dovenv.config,
	dovenv.setIgnoreConfig( [ './docs/**/*', '**/CHANGELOG.md' ] ),
]
