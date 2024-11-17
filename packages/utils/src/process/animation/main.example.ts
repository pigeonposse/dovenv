import { animate } from './main'

( async () => {

	const frames = [
		'⠋ Loading...',
		'⠙ Loading...',
		'⠹ Loading...',
		'⠸ Loading...',
		'⠼ Loading...',
		'⠴ Loading...',
		'⠦ Loading...',
		'⠧ Loading...',
		'⠇ Loading...',
		'⠏ Loading...',
	]

	const animation = await animate( {
		frames,
		interval : 100,
	} )
	animation.start()

	await new Promise( resolve => setTimeout( resolve, 2000 ) )
	animation.stop()

	console.log( 'Done!' ) // Mensaje final

} )()
