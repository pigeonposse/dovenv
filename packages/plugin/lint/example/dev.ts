import { build } from 'dovenv'

await build( [
	'-c',
	'src/main.ts',
	...process.argv.slice( 2 ),
] )
