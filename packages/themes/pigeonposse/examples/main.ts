import { build } from 'dovenv'

await build( [
	'-c',
	'examples/config.ts',
	...process.argv.slice( 2 ),
] )
