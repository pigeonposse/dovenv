import {
	describe,
	expect,
	test,
} from 'vitest'

import { image } from './main'

describe( 'image function', () => {

	test( 'should convert image to ASCII', async () => {

		const imgUrl     = 'https://avatars.githubusercontent.com/u/111685953'
		const asciiImage = await image( {
			input       : imgUrl,
			asciiOutput : true,
		} )
		expect( typeof asciiImage ).toBe( 'string' )
		// console.log( 'ASCII Image:', asciiImage )

	} )

} )

// describe( 'gif function', () => {

// 	test( 'should display GIF in the terminal', async () => {

// 		const gifUrl    = 'https://64.media.tumblr.com/38adef3da23d26058e3085ce271b39c1/tumblr_nil77wk20l1qhnszoo1_400.gifv'
// 		const gifOutput = await gif( gifUrl )
// 		// Aquí puedes agregar aserciones para verificar la salida
// 		console.log( 'GIF Output:', gifOutput )

// 	} )

// } )
