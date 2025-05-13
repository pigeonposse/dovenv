
import { ChalkInstance } from 'chalk'

import { TableConstructorOptions } from '@/styles'

type CardinalThemeColorizer = (
	value: string,
	info: {
		tokens: ReadonlyArray<{
			type  : string
			value : string
		}>
		tokenIndex : number
	},
) => string

interface CardinalThemeTokenRule {
	[key: string] : CardinalThemeColorizer | undefined
	_default?     : CardinalThemeColorizer | undefined
}

export type CardinalTheme = Record<string, CardinalThemeTokenRule | undefined> & { _default?: CardinalThemeColorizer | undefined }

export type CardinalOptions = {
	/** used to optionally override the theme used to highlight */
	theme?     : CardinalTheme | undefined
	/** if `true` line numbers are included in the highlighted code */
	linenos?   : boolean | undefined
	/** sets line number of the first line when line numbers are printed */
	firstline? : number | undefined
	/**
	 * if true JSX syntax is supported, otherwise cardinal will raise an error when encountering JSX
	 *
	 * @default false
	 */
	jsx?       : boolean | undefined
}

export type TerminalRendererOptions = {
	code?         : ChalkInstance | ( ( s: string ) => string ) | undefined
	blockquote?   : ChalkInstance | ( ( s: string ) => string ) | undefined
	html?         : ChalkInstance | ( ( s: string ) => string ) | undefined
	heading?      : ChalkInstance | ( ( s: string ) => string ) | undefined
	firstHeading? : ChalkInstance | ( ( s: string ) => string ) | undefined
	hr?           : ChalkInstance | ( ( s: string ) => string ) | undefined
	listitem?     : ChalkInstance | ( ( s: string ) => string ) | undefined
	table?        : ChalkInstance | ( ( s: string ) => string ) | undefined
	paragraph?    : ChalkInstance | ( ( s: string ) => string ) | undefined
	strong?       : ChalkInstance | ( ( s: string ) => string ) | undefined
	em?           : ChalkInstance | ( ( s: string ) => string ) | undefined
	codespan?     : ChalkInstance | ( ( s: string ) => string ) | undefined
	del?          : ChalkInstance | ( ( s: string ) => string ) | undefined
	link?         : ChalkInstance | ( ( s: string ) => string ) | undefined
	href?         : ChalkInstance | ( ( s: string ) => string ) | undefined
	text?         : ChalkInstance | ( ( s: string ) => string ) | undefined

	/** Formats the bulletpoints and numbers for lists */
	list? : ( ( body: string, ordered?: boolean ) => string ) | undefined

	/** Reflow and print-out width. Only applicable when `reflowText` is true. */
	width? : number | undefined

	reflowText? : boolean | undefined

	/** Should it prefix headers? */
	showSectionPrefix? : boolean | undefined

	/** Whether or not to undo marked escaping of enitities (" -> &quot; etc) */
	unescape? : boolean | undefined

	/** Whether or not to show emojis */
	emoji? : boolean | undefined

	tableOptions? : TableConstructorOptions

	/** The size of tabs in number of spaces or as tab characters */
	tab? : number | undefined
}

