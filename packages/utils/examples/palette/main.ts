
import { join } from 'node:path'

import {
	color,
	getMediaPalette,
	getCurrentDir,
} from '../../dist/main'

const palette = await getMediaPalette( join( getCurrentDir( import.meta.url ), 'logo.png' ) )
console.log( palette )
palette.forEach( d => console.log( color.bgHex( d )( ' Color ' ) ) )
