/**
 * Fork of https://www.npmjs.com/package/ansi-escapes?activeTab=code
 */

import {
	isBrowser,
	process,
} from '@/process'

const ESC = '\u001B['
const OSC = '\u001B]'
const BEL = '\u0007'
const SEP = ';'

const isTerminalApp = !isBrowser && process.env.TERM_PROGRAM === 'Apple_Terminal'
const isWindows     = !isBrowser && process.platform === 'win32'

const cwdFunction = isBrowser
	? () => {

		throw new Error( '`process.cwd()` only works in Node.js, not the browser.' )

	}
	: process.cwd

export const cursorTo = ( x: number, y?: number ): string => {

	if ( typeof x !== 'number' ) throw new TypeError( 'The `x` argument is required' )
	return typeof y === 'number'
		? `${ESC}${y + 1}${SEP}${x + 1}H`
		: `${ESC}${x + 1}G`

}

export const cursorMove = ( x: number, y = 0 ): string => {

	if ( typeof x !== 'number' ) throw new TypeError( 'The `x` argument is required' )

	let output = ''
	if ( x !== 0 ) output += ESC + Math.abs( x ) + ( x < 0 ? 'D' : 'C' )
	if ( y !== 0 ) output += ESC + Math.abs( y ) + ( y < 0 ? 'A' : 'B' )
	return output

}

export const cursorUp = ( count = 1 ) => `${ESC}${count}A`
export const cursorDown = ( count = 1 ) => `${ESC}${count}B`
export const cursorForward = ( count = 1 ) => `${ESC}${count}C`
export const cursorBackward = ( count = 1 ) => `${ESC}${count}D`

export const cursorLeft = `${ESC}G`
export const cursorSavePosition = isTerminalApp ? '\u001B7' : `${ESC}s`
export const cursorRestorePosition = isTerminalApp ? '\u001B8' : `${ESC}u`
export const cursorGetPosition = `${ESC}6n`
export const cursorNextLine = `${ESC}E`
export const cursorPrevLine = `${ESC}F`
export const cursorHide = `${ESC}?25l`
export const cursorShow = `${ESC}?25h`

export const eraseLines = ( count: number ): string => {

	let output = ''
	for ( let i = 0; i < count; i++ ) {

		output += eraseLine + ( i < count - 1 ? cursorUp() : '' )

	}
	return output + cursorLeft

}

export const eraseEndLine = `${ESC}K`
export const eraseStartLine = `${ESC}1K`
export const eraseLine = `${ESC}2K`
export const eraseDown = `${ESC}J`
export const eraseUp = `${ESC}1J`
export const eraseScreen = `${ESC}2J`
export const scrollUp = `${ESC}S`
export const scrollDown = `${ESC}T`
export const clearScreen = '\u001Bc'
export const clearTerminal = isWindows ? `${eraseScreen}${ESC}0f` : `${eraseScreen}${ESC}3J${ESC}H`

export const enterAlternativeScreen = `${ESC}?1049h`
export const exitAlternativeScreen = `${ESC}?1049l`
export const beep = BEL

export const link = ( text: string, url: string ): string =>
	[
		OSC,
		'8',
		SEP,
		SEP,
		url,
		BEL,
		text,
		OSC,
		'8',
		SEP,
		SEP,
		BEL,
	].join( '' )

export type ImageOptions = {
	width?               : string | number | 'auto'
	height?              : string | number | 'auto'
	preserveAspectRatio? : boolean
}

export const image = ( data: Uint8Array, options: ImageOptions = {} ): string => {

	let result = `${OSC}1337;File=inline=1`
	if ( options.width ) result += `;width=${options.width}`
	if ( options.height ) result += `;height=${options.height}`
	if ( options.preserveAspectRatio === false ) result += ';preserveAspectRatio=0'
	return result + ':' + Buffer.from( data ).toString( 'base64' ) + BEL

}

export type AnnotationOptions = {
	length?   : number
	x?        : number
	y?        : number
	isHidden? : boolean
}

export const iTerm = {
	setCwd( cwd: string = cwdFunction() ) {

		return `${OSC}50;CurrentDir=${cwd}${BEL}`

	},

	annotation( message: string, options: AnnotationOptions = {} ): string {

		if ( ( options.x !== undefined || options.y !== undefined ) && (
			options.x === undefined || options.y === undefined || options.length === undefined
		) ) {

			throw new Error( '`x`, `y`, and `length` must all be provided when using coordinates' )

		}

		const sanitized = message.replace( /\|/g, '' )
		const prefix    = `${OSC}1337;${options.isHidden ? 'AddHiddenAnnotation=' : 'AddAnnotation='}`

		const content = options.length
			? ( options.x !== undefined
				? [
					sanitized,
					options.length,
					options.x,
					options.y,
				].join( '|' )
				: [ options.length, sanitized ].join( '|' ) )
			: sanitized

		return prefix + content + BEL

	},
}
