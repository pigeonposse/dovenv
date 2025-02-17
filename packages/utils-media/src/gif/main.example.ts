
import {
	gif,
	gif2ascii,
} from './main'

const delay        = ( ms: number ) => new Promise( resolve => setTimeout( resolve, ms ) )
const pigeonGifUrl = 'https://media.giphy.com/media/0qUEQdlYbG8U0BYn2C/giphy.gif?cid=ecf05e47ud3b4pt3hf3k57oc8z7oa5cbgfwcpj8kt3d1m60a&ep=v1_gifs_search&rid=giphy.gif&ct=gC'
const animationGif = await gif2ascii( {
	input : pigeonGifUrl,
	chars : ' *#',
	width : '80%',
} )
console.log( 'before start' )
animationGif.start()
await delay( 5000 )
animationGif.stop()
console.log( 'after stop' )

const pigeonAnimation = await gif( {
	input : pigeonGifUrl,
	width : '100%',
	// asciiOutput : true,
} )
console.log( 'before start' )
pigeonAnimation.start()
console.log( 'before delay' )
await delay( 5000 )
console.log( 'after delay' )
pigeonAnimation.stop()
console.log( 'after stop' )
