import { argv } from 'node:process'

/**
 * Checks if a flag exists and the value matches one of the given values.
 *
 * @param   {string}                 v      - The key of the flag to check.
 * @param   {Record<string, string>} values - An object with values to check against the value of the flag.
 * @returns {string | undefined}            The value of the flag if it exists and matches one of the given values, or undefined.
 */
export const getChoiceFlagValue = <VALUES>( v: string, values: Record<string, VALUES> ): VALUES | undefined => {

	const value = getStringFlagValue( v )

	if ( value && ( Object.values( values ) as unknown[] ).includes( value ) )
		return value as VALUES

	return undefined

}

/**
 * Gets the value of a flag passed to the process.
 *
 * @param   {string}             key - The key of the flag to get the value of.
 * @returns {string | undefined}     The value of the flag if it exists, or undefined.
 */
export const getStringFlagValue = ( key: string ) => {

	const flagLine = key.length === 1 ? '-' : '--'
	const flags    = argv
	for ( let i = 0; i < flags.length; i++ ) {

		const flag = flags[i]

		// Formato --key=value
		if ( flag.startsWith( `${flagLine}${key}=` ) )
			return flag.split( '=' )[1]

		// Formato --key value
		if ( flag === `${flagLine}${key}` && flags[i + 1] && !flags[i + 1].startsWith( flagLine ) )
			return flags[i + 1]

	}
	return undefined

}

/**
 * Gets the values of a flag passed to the process.
 *
 * @param   {string}               key - The key of the flag to get the values of.
 * @returns {string[] | undefined}     The values of the flag if it exists, or undefined.
 *                                     The values are returned as an array. If the flag appears multiple times, their values are concatenated.
 *                                     The flag can appear in two formats:
 *                                     - `--key=value1,value2,...` - The values are separated by commas.
 *                                     - `--key value1 value2 ...` - The values follow the flag in separate arguments.
 */
export const getArrayFlagValue = ( key: string ): string[] | undefined => {

	const flags    = argv
	const flagLine =  key.length === 1 ? '-' : '--'

	let values: string[] = []

	for ( let i = 0; i < flags.length; i++ ) {

		const flag = flags[i]

		// Formato --key=value1,value2,...
		if ( flag.startsWith( `${flagLine}${key}=` ) ) {

			values = flag.split( '=' )[1].split( ',' )
			break

		}

		// Formato --key value1 value2 ...
		if ( flag === `${flagLine}${key}` ) {

			for ( let j = i + 1; j < flags.length; j++ ) {

				if ( flags[j].startsWith( flagLine ) ) break
				values.push( flags[j] )

			}
			break

		}

	}
	return values.length > 0 ? values : undefined

}

/**
 * Checks if a boolean flag exists in the process arguments.
 *
 * @param   {string}  v - The boolean flag to check for existence.
 * @returns {boolean}   True if the flag exists, false otherwise.
 */
export const getBooleanFlagValue = ( v: string ) => {

	const flagLine = v.length === 1 ? '-' : '--'
	return argv.includes( `${flagLine}${v}` )

}

/**
 * Checks if a specific command exists in the process arguments.
 *
 * @param   {string}  v - The command to check for existence.
 * @returns {boolean}   True if the command exists in the process arguments; otherwise, false.
 */
export const getCmd = ( v: string ) => argv.includes( v )

/**
 * Checks if there are additional command-line options provided.
 *
 * @returns {boolean} True if there are more than two arguments in the process.argv array, indicating the presence of options; otherwise, false.
 */
export const existsOptions = () =>
	argv.length > 2
