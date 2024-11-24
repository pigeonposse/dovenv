import type {
	consoleType,
	stdType,
} from './const'
import type {
	ObjectValues,
	Prettify,
} from '../../ts/main'

export type StdType = ObjectValues<typeof stdType>
export type ConsoleType = ObjectValues<typeof consoleType>

export type onStdOpts = {
	/**
	 * Function to transform the output before replacing it.
	 * @example
	 * const fn = ( { data, type } ) => {
	 *    return type === 'stderr' ? data.toUpperCase() : data
	 * }
	 */
	fn : ( opts: {
		data : string
		type : StdType
	} ) => string
	/**
	 * processs object to replace output in.
	 * @default process
	 */
	process? : NodeJS.Process
	/**
	 * Type of stream to replace output in.
	 * @default 'stdout'
	 */
	type?    : Prettify<StdType[] | StdType>
}

export type ReplaceStdOpts = Prettify<Omit<onStdOpts, 'fn'> & {
	/**
	 * Params object containing key-value pairs where each key is a string to be replaced by its corresponding value in the output.
	 * @example {
	 *   'error': 'warning'
	 * }
	 */
	params     : Record<string, string>
	/**
	 * Function to transform the output before replacing it.
	 * @example
	 * const transform = ( { data, type } ) => {
	 *    return type === 'stderr' ? data.toUpperCase() : data
	 * }
	 */
	transform? : onStdOpts['fn']
}>

export type onConsoleOpts = {
	/**
	 * Function to transform the output before replacing it.
	 * @example
	 * const fn = ( { data, type } ) => {
	 *    return type === 'error' ? data.toUpperCase() : data
	 * }
	 */
	fn : ( opts: {
		data : string
		type : ConsoleType
	} ) => string
	/**
	 * Type of stream to replace output in.
	 * @default 'log'
	 */
	type? : Prettify<ConsoleType[] | ConsoleType>
}

export type ReplaceConsoleOpts = Prettify<Omit<onConsoleOpts, 'fn'> & {
	/**
	 * Params object containing key-value pairs where each key is a string to be replaced by its corresponding value in the output.
	 * @example {
	 *   'error': 'warning'
	 * }
	 */
	params     : Record<string, string>
	/**
	 * Function to transform the output before replacing it.
	 * @example
	 * const transform = ( { data, type } ) => {
	 *    return type === 'warm' ? data.toUpperCase() : data
	 * }
	 */
	transform? : onConsoleOpts['fn']
}>
