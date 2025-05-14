import { process } from '@dovenv/core/utils'

/**
 * Registers an asynchronous cleanup callback to be executed before the process exits.
 *
 * This utility listens to common termination signals and ensures the provided
 * callback runs before the Node.js process shuts down. It's useful for deleting
 * temporary files, closing connections, or releasing other resources.
 *
 * Handled events:
 * - 'SIGINT' (e.g. Ctrl+C)
 * - 'SIGTERM' (e.g. kill command, Docker stop, CI shutdown)
 * - 'beforeExit' (when the event loop is empty and the process is about to exit)
 *
 * @param {() => Promise<void>} callback - An async function that performs cleanup logic.
 *                                       It will be awaited before exiting the process.
 * @param {number}              [code]   - The exit code to use when the process exits.
 * @example
 * registerCleanup(async () => {
 *   await removeTempFiles()
 *   console.log('Cleanup complete.')
 * })
 */
export const registerCleanup = ( callback: () => Promise<void>, code = 0 ) => {

	process.on( 'SIGINT', async () => {

		await callback()
		process.exit( code )

	} )

	process.on( 'SIGTERM', async () => {

		await callback()
		process.exit( code )

	} )

	process.on( 'beforeExit', async () => {

		await callback()
		process.exit( code )

	} )

}

export const okMark = '\x1B[32m✓\x1B[0m'
export const errorMark = '\x1B[31m✗\x1B[0m'
