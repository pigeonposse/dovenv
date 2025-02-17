// nothing
import { resolve } from 'path'

import * as dist from '../dist/main.mjs'

// Object.keys( dist ).forEach( d => console.log( d ) )
// console.dir( { functions: Object.keys( dist ) }, { depth: Infinity } )
const path = resolve( '../../docs/public/banner.png' )

console.log( path )
const palette = await dist.getMediaPalette( path )
console.log( palette )
palette.forEach( d => console.log( dist.color.bgHex( d )( ' Text ' ) ) )
