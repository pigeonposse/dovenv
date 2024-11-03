
import {
	joinPath,
	getCurrentDir,
} from '@dovenv/utils'

import { build } from '../src/main'

const config = joinPath( getCurrentDir( import.meta.url ), 'config.ts' )

await build( [
	'--config',
	config,
	'transform',
] )
