import { createPlugin } from './main'

const plugin = createPlugin<{ t?: boolean }>( data => {

	console.log( data )
	return {}

} )

const p = plugin( { t: false } )

console.log( p )
