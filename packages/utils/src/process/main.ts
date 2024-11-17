
import process from 'node:process'

export * from './flag'
export * from './cli'
export * from './exec'
export * from './env'
export * from './log'
export * from './time'
export * from './animation/main'
export * from './prompts/main'

export const isDev = () => process.env.NODE_ENV !== 'production'

export { process }

export const rmDeprecationAlerts = () => {

	// This is not recomended but is for not display `(node:31972) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.` message.
	// @ts-ignore
	process.noDeprecation = true

}

export const onExit = ( cb: NodeJS.ExitListener ) => {

	process.on( 'exit', cb )

}

export const cancel = () => process.exit( 130 )

export const onCancel = ( cb: NodeJS.ExitListener ) => {

	process.on( 'SIGINT', cb )

}

/**
 * Replaces certain values in the output of a process.
 * @param {Record<string, string>} replacements - An object with pairs of values to replace.
 * @returns {void}
 * @description
 * This function replaces certain values in the output of a process according to the rules defined in the `replacements` object.
 * @example
 * replaceOutputFromProcess({ 'v1.3.4': 'v2.1.9' });
 */
export const replaceOutputFromProcess = ( replacements: Record<string, string> ) => {

	const originalStdoutWrite = process.stdout.write
	const originalStderrWrite = process.stderr.write

	// Experimental
	// @ts-ignore: for empty write
	process.stdout.write = ( chunk, ...args ) => {

		let output = typeof chunk === 'string' ? chunk : chunk.toString()

		for ( const [ value, replaceValue ] of Object.entries( replacements ) ) {

			output = output.replace( new RegExp( value, 'g' ), replaceValue )

		}
		// @ts-ignore: args is not correct typed
		originalStdoutWrite.call( process.stdout, output, ...args )

	}

	// Experimental
	// @ts-ignore: for empty write
	process.stderr.write = ( chunk, ...args ) => {

		let output = typeof chunk === 'string' ? chunk : chunk.toString()

		for ( const [ value, replaceValue ] of Object.entries( replacements ) ) {

			output = output.replace( new RegExp( value, 'g' ), replaceValue )

		}

		// @ts-ignore: args might not be typed correctly
		originalStderrWrite.call( process.stderr, output, ...args )

	}

}
