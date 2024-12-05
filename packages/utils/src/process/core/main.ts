/* eslint-disable jsdoc/no-undefined-types */

import process from 'node:process'

export * from './env'
export { process }

export * from './std'
export * from './console'

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
 * Show/hide deprecation warnings in the process.
 *
 * This function sets the `process.noDeprecation` property to `true` | `false`
 * Note: This is not recommended for production environments, as it might
 * hide useful deprecation warnings that should be addressed.
 * @returns {object} An object with `show` and `hide` methods.
 * @example
 * const { show, hide } = deprecatedAlerts()
 * hide()
 * // my code
 * show()
 */

export const deprecatedAlerts = () => {

	return {
		show : () => {

			// @ts-ignore
			process.noDeprecation = false

		},
		hide : () => {

			// @ts-ignore
			process.noDeprecation = true

		},
	}

}
/**
 * Registers an event listener that will be called when the Node.js process exits.
 * @param {NodeJS.ExitListener} cb - The callback to be called when the process exits.
 */
export const onExit = ( cb: NodeJS.ExitListener ) => {

	process.on( 'exit', cb )

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
 * Terminates the Node.js process with exit code 130.
 *
 * This function is typically used to gracefully handle process termination,
 * such as when the user sends an interrupt signal (e.g., pressing Ctrl+C in the terminal).
 */
export const cancel = () => {

	process.exit( 130 )

}

