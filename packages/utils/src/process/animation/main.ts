import logUpdate from 'log-update'

import type { AnimateProps } from './types'

/**
 * Creates an animation function that can be started and stopped.
 * @param {object} [options] - Options for the animation.
 * @param {string[]} [options.frames] - Frames of the animation.
 * @param {number} [options.interval] - Interval in milliseconds between frames.
 * @param {boolean} [options.clear] - Whether to clear the screen after stopping the animation.
 * @returns {object} - Object containing `start` and `stop` functions.
 */
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
