import { createPlugin } from './main'

const plugin = createPlugin<{ t?: true }>( data => {

	console.log( data )
	return {}

} )

const p = plugin(  )

console.log( p )
