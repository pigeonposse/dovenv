import { text } from '@clack/prompts'

import type {
	NumberParams, NumberPrompt,
} from './types'

/**
 * Prompt for number type.
 *
 * @param   {NumberParams}             opts - NumberOptions.
 * @returns {Promise<string | symbol>}      - Promise resolving the answer.
 * @example
 * const age = await number({
 *   message: 'What is your age?',
 *   errorText: 'failed',
 * });
 * console.log(age)
 */
export const number: NumberPrompt = async ( opts: NumberParams ) => {

	const res = await text( {
		...opts,
		validate : value => {

			if ( !value || value.trim() === '' )
				return opts.errorText || 'The value must exist and must be a number'

			const isNum    = !isNaN( Number( value ) )
			const errorMsg = opts.errorText || 'Value must be a number'

			if ( !isNum || /\s/.test( value ) ) return errorMsg
			if ( /\s/.test( value ) ) return errorMsg
			if ( opts.validate ) return opts.validate( value )

		},
	} )
	if ( typeof res === 'string' ) return Number( res )
	return res

}

