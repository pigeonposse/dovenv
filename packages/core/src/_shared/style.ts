/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import {
	color,
	icon,
	table,
	box,
	line,
	highlight,
	indent,
} from '@dovenv/utils'

type ExtractLiterals<T> = T extends string ? ( string extends T ? never : T ) : never
type Line =  NonNullable<Parameters<typeof line>[0]>
type Color = NonNullable<Line['lineColor']>
type ColorLiteral = ExtractLiterals<Color>

const 		codeConstructor = ( {
	data,
	title = undefined,
	lang = undefined,
	borderColor,
} : {
	data         : Parameters<typeof box>[0]
	title?       : string
	lang?        : NonNullable<Parameters<typeof highlight>[1]>['language']
	borderColor? : NonNullable<Parameters<typeof box>[1]>['borderColor']
} ) => {

	return box( highlight( data, { language: lang  } ), {
		title,
		dimBorder : true,
		borderColor,
		padding   : {
			top   : 1,
			left  : 1,
			right : 1,
		},
		borderStyle : {
			bottom      : icon.line,
			top         : icon.line,
			left        : '',
			right       : '',
			bottomRight : icon.line,
			topRight    : icon.line,
			bottomLeft  : icon.line,
			topLeft     : icon.line,
		},

	} )

}

const colorConstructor = ( cValue: ColorLiteral | undefined, mainIcon?: typeof icon[keyof typeof icon] ) => {

	const c = cValue ? color[cValue] : color

	const title     = ( v:unknown ) => c( mainIcon ? ( mainIcon + ' ' + v ) : v )
	const desc      = ( v:unknown ) => c.dim( v )
	const listKey   = ( v:unknown ) => c( icon.bullet + ' ' + v )
	const listValue = ( v:unknown ) => desc( v )
	const li        = ( t:unknown, v:unknown ) => listKey( t ) + ' ' + listValue( v )
	const a         = ( msg: string ) => c.italic.underline(  msg )
	const badge     = ( msg: unknown ) => c.inverse( ' ' + msg + ' ' )
	const bold      = ( msg: unknown ) => c.bold( msg )
	const hr        = ( title?: string, titleAlign?: Line['titleAlign'], dim?: boolean  ) => {

		return `\n${line( {
			title      : title || title?.trim() !== '' ? title : '',
			lineColor  : cValue,
			titleAlign : titleAlign || 'center',
			lineChar   : icon.line,
			lineDim    : dim,
		} )}\n`

	}

	return {
		icon : mainIcon,
		/** main title */
		h1   : ( v:unknown ) => title( badge( bold( v ) ) ),
		/** general title */
		h    : ( v:unknown ) => title( bold( v ) ),
		/** general text */
		text : ( v:unknown ) => c( v ),
		msg  : ( t:string, msg?:unknown ) => bold( t ) + ( msg ? ' ' + desc( msg ) : '' ),
		code : ( {
			desc: descV, code: codeV, lang, readmore,
		}:{
			desc      : string
			code      : string
			lang?     : string
			readmore? : string
		} ) => {

			return desc( descV ) + ( codeV
				? '\n\n' + codeConstructor( {
					data        : codeV,
					title       : 'Example',
					lang        : lang,
					borderColor : cValue,
				} )
				: '' ) + ( readmore ? desc( '\n\nRead more: ' + a( readmore ) ) : '' ) + '\n'

		},
		/** List key */
		lk : ( v:unknown ) => c( icon.bullet + ' ' + v ),
		/** List value */
		lv : ( v:unknown ) => desc( v ),
		/** List item */
		li : ( k:unknown, v:unknown ) => li( k, v ),
		/** unordered list */
		ul : ( list: Array<[ unknown, unknown ]> ) => list.map( ( [ k, v ] ) => li( k, v ) ).join( '\n' ),
		/** paragraph */
		p  : desc,
		/** Anchor */
		a,
		/** Bold */
		b  : bold,
		/** Badge */
		badge,
		/** Line / sepator */
		hr,
	}

}
const noColor = colorConstructor( undefined, icon.dot )
export class CommandStyle {

	color : typeof color = color
	line  : typeof line = line
	icon  : typeof icon = icon

	/**
	 * Indent text.
	 * @param {string} v - text
	 * @param {string} [prefix] - prefix
	 * @returns {string} Text indented
	 */
	indent = indent

	////////////////////////////////////////////////////////////
	// parts
	main    = colorConstructor( 'blue' )
	section = colorConstructor( 'blue', icon.triangleRightSmall )
	error   = colorConstructor( 'red', icon.cross )
	warn    = colorConstructor( 'yellow', icon.warning )
	success = colorConstructor( 'green', icon.tick )
	info    = colorConstructor( undefined, icon.info )

	////////////////////////////////////////////////////////////
	// others

	/**
	 * Anchor (LINK)
	 */
	a = noColor.a

	/**
	 * Paragraph
	 */
	p = noColor.p

	/**
	 * Badge
	 */
	badge = noColor.badge

	/**
	 * Bold
	 */
	b = noColor.b

	table( data: Parameters<typeof table>[0], opts?: Parameters<typeof table>[1] ) {

		return table(
			data,
			{
				drawHorizontalLine : () => false,
				drawVerticalLine   : () => false,
				...( opts || {} ),
			},
		)

	}

	box( {
		data,
		title = undefined,
		border = true,
		dim = true,
	} : {
		data    : Parameters<typeof box>[0]
		title?  : string
		border? : boolean
		dim?    : boolean
	} ) {

		return box( data, {
			title,
			dimBorder : dim,
			padding   : {
				top   : 1,
				left  : 1,
				right : 1,
			},
			borderStyle : !border ? 'none' : 'single',
		} )

	}

	code = codeConstructor

}
