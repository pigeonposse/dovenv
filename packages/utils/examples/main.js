import { image } from '../dist/main.js'

const run = async () => {

	const asciiImage = await image(  {
		input       : 'https://avatars.githubusercontent.com/u/111685953',
		asciiOutput : true,
	} )
	console.log( asciiImage )

}

run()
