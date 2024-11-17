import logUpdate from 'log-update'

import type { AnimateProps } from './types'

export const animate = ( {
	frames,
	interval = 100,
	clear = false,
}: AnimateProps ) => {

	let isRunning = false,
		currentFrame                             = 0,
		animationInterval: NodeJS.Timeout | null = null

	const start = () => {

		if ( isRunning ) return
		isRunning = true

		animationInterval = setInterval( () => {

			logUpdate( frames[currentFrame] )
			currentFrame = ( currentFrame + 1 ) % frames.length

		}, interval )

	}

	const stop = () => {

		if ( !isRunning ) return
		isRunning = false

		if ( animationInterval ) {

			clearInterval( animationInterval )
			animationInterval = null

		}
		if ( clear )
			logUpdate.clear()

	}

	return {
		start,
		stop,
	}

}
