// import {
// 	getCurrentDir,
// 	joinPath,
// } from '@dovenv/utils'
import { build } from 'dovenv'

// const dir    = getCurrentDir( import.meta.url )
// const config = joinPath( dir, 'config.ts' )

await build( [
	'-c',
	'examples/config.ts',
	...process.argv.slice( 2 ),
] )
