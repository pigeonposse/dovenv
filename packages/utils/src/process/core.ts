/* eslint-disable jsdoc/no-undefined-types */

import process from 'node:process'

export { process }

/**
 * Checks if the environment is a development environment.
 * @returns {boolean} True if the environment is a development environment.
 */
export const isDev = () =>
	process.env.NODE_ENV !== 'production'

/**
 * Suppresses deprecation warnings in the process.
 *
 * This function sets the `process.noDeprecation` property to `true`,
 * which prevents Node.js from displaying deprecation warnings
 * such as `[DEP0040] DeprecationWarning: The 'punycode' module is deprecated`.
 *
 * Note: This is not recommended for production environments, as it might
 * hide useful deprecation warnings that should be addressed.
 */
export const rmDeprecationAlerts = () => {

	// This is not recomended but is for not display `(node:31972) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.` message.
	// @ts-ignore
	process.noDeprecation = true

}

/**
 * Registers an event listener that will be called when the Node.js process exits.
 * @param {NodeJS.ExitListener} cb - The callback to be called when the process exits.
 */
export const onExit = ( cb: NodeJS.ExitListener ) => {

	process.on( 'exit', cb )

}

/**
 * Terminates the Node.js process with exit code 130.
 *
 * This function is typically used to gracefully handle process termination,
 * such as when the user sends an interrupt signal (e.g., pressing Ctrl+C in the terminal).
 */
export const cancel = () => {

	process.exit( 130 )

}

/**
 * Registers an event listener that will be called when the user sends an
 * interrupt signal (e.g., pressing Ctrl+C in the terminal).
 * @param {NodeJS.ExitListener} cb - The callback to be called when the user
 * sends an interrupt signal.
 */
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
