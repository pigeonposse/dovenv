import {
	exec as execNode,
	fork,
	spawn,
	type SpawnOptions,
} from 'node:child_process'
import process           from 'node:process'
import { npmRunPathEnv } from 'npm-run-path'

import { catchError }    from '../../error/main'
import { box }           from '../../styles/main'
import { getModulePath } from '../../sys/module'

/**
 * Runs a local binary in the current project.
 *
 * It uses the `PATH` and `npm-run-path` to locate the binary in the project's `node_modules/.bin`.
 * @param   {object}  options - Options object.
 * @param   {string}  options.name - Name of the bin to run.
 * @param   {string[]} options.args - Args to pass to the bin.
 * @param   {object}  [options.opts] - Options object.
 * @returns {Promise<number>} - Resolves with the exit code of the bin.
 * @throws  {Error} - If the bin exits with a non-zero code.
 */
export const runLocalBin = async ( {
	name, args, opts,
}:{
	name  : string
	args? : string[]
	opts? : Parameters<typeof npmRunPathEnv>[0]
} ): Promise<number> => {

	return new Promise( ( resolve, reject ) => {

		const env = npmRunPathEnv( opts )

		const child = spawn( name, args || [], {
			env,
			cwd   : opts?.cwd || process.cwd(),
			shell : true,
			stdio : 'inherit', // Inherit stdio to allow user prompts
		} )

		child.on( 'error', error => {

			reject( new Error( `Failed to execute '${name}': ${error.message}` ) )

		} )

		child.on( 'close', code => {

			if ( code !== 0 ) {

				reject( new Error( `Process '${name}' exited with code ${code}` ) )

			}
			else {

				resolve( code )

			}

		} )

	} )
	// return new Promise( ( resolve, reject ) => {

	// 	const env = npmRunPathEnv( opts )

	// 	execFile(
	// 		name,
	// 		args,
	// 		{
	// 			env,
	// 			cwd   : opts?.cwd || process.cwd(),
	// 			shell : true,
	// 		},
	// 		( error, _stdout, stderr ) => {

	// 			if ( error ) {

	// 				reject( new Error( error.message || stderr ) )
	// 				return

	// 			}

	// 			resolve( 0 ) // Process exited successfully

	// 		},
	// 	)

	// } )

}

/**
 * Executes a command in the shell and waits for it to finish.
 * @param {string} cmd - The command to execute.
 * @returns {Promise<void>} - A promise that resolves when the command finishes successfully.
 * @throws {Error} - Throws an error if the command fails.
 */
export const exec = async ( cmd: string ): Promise<void> => {

	await new Promise<void>( ( resolve, reject ) => {

		const childProcess = spawn( cmd, {
			shell : true,
			stdio : 'inherit',
		} )

		childProcess.on( 'close', code => {

			if ( code === 0 ) resolve()
			else {

				const error = new Error( `Command failed with code ${code}` )
				console.error( error )
				reject( error )

			}

		} )

	} )

}

/**
 * Executes a command in a child process and captures its output.
 * @param {string} cmd - The command to execute.
 * @returns {Promise<{ stdout: string; stderr: string }>} - A promise that resolves with the output of the command.
 * @throws {Error} - Throws an error if the command fails, along with its stdout and stderr.
 */
export const execChild = async ( cmd: string ): Promise<{
	stdout : string
	stderr : string
}> => {

	return new Promise<{
		stdout : string
		stderr : string
	}>( ( resolve, reject ) => {

		const options: SpawnOptions = {
			shell : true,
			stdio : 'pipe',
		}

		const childProcess = spawn( cmd, options )

		let stdout = '',
			stderr = ''

		childProcess.stdout?.on( 'data', data => {

			stdout += data.toString()

		} )

		childProcess.stderr?.on( 'data', data => {

			stderr += data.toString()

		} )

		childProcess.on( 'close', code => {

			if ( code === 0 ) {

				resolve( {
					stdout,
					stderr,
				} )

			}
			else {

				const data = {
					code,
					stdout,
					stderr,
				}
				reject( data )

			}

		} )

		// Maneja errores del proceso
		childProcess.on( 'error', err => {

			reject( err )

		} )

	} )

}

type Log = {
	debug   : ( data: unknown ) => void
	info    : ( data: unknown ) => void
	success : ( data: unknown ) => void
	warn    : ( data: unknown ) => void
	error   : ( data: unknown ) => void
	box     : ( data: string ) => void
}

type ExecProcessParams = {
	name     : string
	on       : ( context: { log: Log } ) => Promise<void>
	onError?   : ( context: {
		log   : Log
		error : unknown
	} ) => Promise<void>
	onExit?    : ( context: { log: Log } ) => Promise<void>
	onSuccess? : ( context: { log: Log } ) => Promise<void>
}

/**
 * Executes a process with logging and error handling.
 * @param   {object}        options             - Options for the process execution.
 * @param   {string}        options.name        - The name of the process, used in logs.
 * @param   {Function}      options.on          - The main function to execute the process. Receives an object with the `log` utility.
 * @param   {Function}      [options.onError]   - On success function.
 * @param   {Function}      [options.onSuccess] - Optional exit handling function for graceful exits. Receives an object with `log`.
 * @param   {Function}      [options.onExit]    - Optional exit handling function for graceful exits. Receives an object with `log`.
 * @returns {Promise<void>}                     - Resolves when the process execution completes.
 * @example
 * const onProcess = async ({ log }) => {
 *     log.info('Starting the process...');
 *     // Your process logic here
 *     log.success('Process completed successfully.');
 * };
 *
 * const onError = async ({ log, error }) => {
 *     log.error('An error occurred:', error);
 * };
 *
 * execProcess({
 *     name: 'MyProcess',
 *     on: onProcess,
 *     onError,
 * });
 */
export const execProcess = async ( options : ExecProcessParams ): Promise<void> => {

	const {
		name, on, onError, onExit, onSuccess,
	} = options

	const isDebugMode = process.argv.includes( '--debug' )
	const log :Log    = {
		debug : data => {

			if ( isDebugMode )console.debug( `\n🐦⬛ [${name}]`, data )

		},
		info    : data => console.log( `\n🐦🟦 [${name}]`, data ),
		success : data => console.log( `\n🐦✅ [${name}]`, data ),
		warn    : data => console.warn( `\n🐦🟡 [${name}]`, data ),
		error   : data => console.error( `\n🐦❌ [${name}] Error: `, data ),
		box     : data => console.log( `\n${box( data, {
			padding : 1,
			title   : `🐦🟦 [${name}]`,
		} )}` ),
	}

	try {

		log.info( 'Init process \n' )

		console.group()
		await on( { log } )
		console.groupEnd()

		if ( onSuccess ) await onSuccess( { log } )
		else log.success( 'Process executed successfully \n' )

	}
	catch ( error ) {

		console.groupEnd()
		// @ts-ignore: error is unknown
		if ( error.name === 'ExitPromptError' ) {

			if ( onExit ) await onExit( { log } )
			else log.warn( 'Exit from process' )

		}
		else {

			if ( onError ) await onError( {
				log,
				error,
			} )
			else log.error( error )

		}

	}

}

/**
 * Executes a command and captures its output.
 * @param {string} command - The command to execute, including any arguments.
 * @returns {Promise<string>} A promise that resolves with the captured output (stdout).
 * @throws Will reject with an error if the command fails.
 * @example
 * const [error, output] = await catchExecOutput('dovenv --help')
 * if (error) {
 *   console.error(error);
 * } else {
 *   await writeFile('dovenvHelp.txt', output)
 * }
 */
export const catchExecOutput = <Res = string>( command: string ) => {

	return catchError ( new Promise<Res>( ( resolve, reject ) => {

		execNode( command, ( error, stdout, stderr ) => {

			if ( error ) {

				reject( {
					error,
					stdout,
					stderr,
				} )
				return

			}
			resolve( stdout as Res )

		} )

	} ),
	)

}

/**
 * Execute a module from a given path.
 * @param {object} params - Parameters for module execution.
 * @param {string} params.module - The module to execute.
 * @param {string[]} [params.args] - The arguments to pass to the module.
 * @returns {Promise<void>} A promise that resolves when the module has finished executing.
 * @throws Will reject with an error if the module fails to execute.
 * @example
 *
 * // Execute the `bin/index.mjs` file in the `@dovenv/utils` module
 * await execModulePath({
 *   module: {
 * 	  id: 'dovenv',
 * 	  path: ['dist','cli.mjs'],
 *   },
 *   args: ['--help']
 * })
 */
export const execModulePath = async ( {
	module,
	args = [],
}:{
	module : Parameters<typeof getModulePath>[0]
	args?  : string[]
} ) => {

	const binPath = await getModulePath( module )
	await new Promise<void>( ( resolve, reject ) => {

		const child = fork( binPath, args, { stdio: 'inherit' } )
		child.on( 'close', code => {

			if ( code === 0 ) return resolve()

			console.warn( `[${module.id}] exited with code ${code}` )
			return reject()

		} )

	} )

}

/**
 * Execute a module from a given path and capture its output.
 * @param {object} params - Parameters for module execution.
 * @param {string} params.module - The module to execute.
 * @param {string[]} [params.args] - The arguments to pass to the module.
 * @returns {Promise<{ stdout: string; stderr: string }>} A promise that resolves with the captured output.
 * @throws Will reject with an error if the module fails to execute.
 * @example
 *
 * // Execute the `bin/index.mjs` file in the `dovenv` module and capture its output
 * const { stdout, stderr } = await execModulePathWithOutput({
 *   module: {
 * 	  id: 'dovenv',
 * 	  path: ['dist','cli.mjs'],
 *   },
 *   args: ['--help']
 * })
 * console.log('Output:', stdout)
 */
export const execModulePathWithOutput = async ( {
	module,
	args = [],
}:{
	module : Parameters<typeof getModulePath>[0]
	args?  : string[]
} ): Promise<{
	stdout : string
	stderr : string
}> => {

	const binPath = await getModulePath(  module )
	return new Promise( ( resolve, reject ) => {

		const child = fork( binPath, args, { stdio : [
			'pipe',
			'pipe',
			'pipe',
			'ipc',
		] } )

		let stdout = '',
			stderr = ''

		if ( child.stdout ) {

			child.stdout.on( 'data', data => ( stdout += data.toString() ) )

		}

		if ( child.stderr ) {

			child.stderr.on( 'data', data => ( stderr += data.toString() ) )

		}

		child.on( 'close', code => {

			if ( code === 0 ) {

				return resolve( {
					stdout,
					stderr,
				} )

			}
			else {

				console.warn( `[${module.id}] exited with code ${code}` )
				return reject( new Error( `Process exited with code ${code}` ) )

			}

		} )

		child.on( 'error', err => {

			reject( err )

		} )

	} )

}

export const existsLocalBin = async ( binName: string ) => {

	const command = process.platform === 'win32' ? `where ${binName}` : `which ${binName}`

	try {

		await execChild( command )
		return true

	}
	catch ( _e ) {

		return false

	}

}
export const existsLocalBins = async <Bin extends string>( binaries: Bin[] ): Promise<{ [key in Bin]: boolean }> => {

	type Bins = { [key in Bin]: boolean }
	const existingBinaries = {} as Bins

	// Crea un array de promesas para cada binario
	const checks = binaries.map( async bin => {

		const exists = await existsLocalBin( bin )

		existingBinaries[bin] = exists

	} )

	await Promise.all( checks )
	return existingBinaries

}
