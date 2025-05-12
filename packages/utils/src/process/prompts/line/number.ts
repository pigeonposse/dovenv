
import { TextPrompt } from '@clack/core'

import {
	symbol,
	symbols,
}  from './state'
import { color } from '../../../styles'

import type { NumberParams } from './types'

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
export default async function number( opts: NumberParams ) {

	return new TextPrompt( {

		validate : ( value: string ) => {

			const errorDefault = 'Value must be a number without'
			const spaces       = /\s/.test( value )
			const isNum        = typeof Number( value ) === 'number' && !isNaN( Number( value ) )
			if ( !value || !isNum ) return opts.errorText ? opts.errorText : errorDefault
			if ( spaces ) return opts.errorText ? opts.errorText : errorDefault
			if ( opts.validate ) return opts.validate( value )

		},
		placeholder  : opts.placeholder,
		defaultValue : opts.defaultValue,
		initialValue : opts.initialValue,
		render() {

			const title       = `${color.gray( symbols.BAR )}\n${symbol( this.state )}  ${opts.message}\n`
			const placeholder = opts.placeholder
				// @ts-ignore: todo
				? color.inverse( opts.placeholder[0] ) + color.dim( opts.placeholder.slice( 1 ) )
				: color.inverse( color.hidden( '_' ) )
			const value       = !this.value ? placeholder : this.valueWithCursor

			switch ( this.state ) {

				case 'error' :
					return `${title.trim()}\n${color.yellow( symbols.BAR )}  ${value}\n${color.yellow(
						symbols.BAR_END,
					)}  ${color.yellow( this.error )}\n`
				case 'submit' :
					return `${title}${color.gray( symbols.BAR )}  ${color.dim( this.value || opts.placeholder )}`
				case 'cancel' :
					return `${title}${color.gray( symbols.BAR )}  ${color.strikethrough(
						color.dim( this.value ?? '' ),
					)}${this.value?.trim() ? '\n' + color.gray( symbols.BAR ) : ''}`
				default :
					return `${title}${color.cyan( symbols.BAR )}  ${value}\n${color.cyan( symbols.BAR_END )}\n`

			}

		},
	} ).prompt() as Promise<string | symbol>

}
