import { getMediaPalette } from './main'
import { color }           from '../styles/main'

const palette = await getMediaPalette( 'https://collectium.pigeonposse.com/logo.png' )
console.log( palette )
palette.forEach( d => console.log( color.bgHex( d )( ' Color ' ) ) )
