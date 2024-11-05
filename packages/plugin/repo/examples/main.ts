import {
	resolvePath,
	getCurrentDir,
} from '@dovenv/utils'
import { build } from 'dovenv'

await build( [
	'-c',
	resolvePath( getCurrentDir( import.meta.url ), 'config.ts' ),
	...process.argv.slice( 2 ),
] )
