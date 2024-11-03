import { image } from '../dist/main.js'

const run = async () => {

	const imgUrl     = 'https://avatars.githubusercontent.com/u/111685953'
	const asciiImage = await image( imgUrl, { asciiOutput: true } )
	console.log( asciiImage )

}

run()
