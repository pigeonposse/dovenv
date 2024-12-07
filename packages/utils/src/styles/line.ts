import { box }          from './table'
import { terminalSize } from '../process/core/main'

type LineAlign = 'left' | 'center' | 'right'
type TitleAlign = `${LineAlign}` | `top-${LineAlign}` | `bottom-${LineAlign}`
type Color = NonNullable<Parameters<typeof box>[1]>['borderColor']
type LineProps = {
	title?      : string
	lineChar?   : string
	lineColor?  : Color
	lineDim?    : boolean
	align?      : LineAlign
	titleAlign? : TitleAlign
	width?      : number
}
type CreateLine = Required<Omit<LineProps, 'titleAlign' | 'title' | 'lineColor'>> & {
	titleAlign : LineAlign
	title?     : string
	lineColor? : Color
}

const createLine = ( props: CreateLine ) => {

	const x100 = ( v: number, percent: number ) =>
		( v * percent ) / 100

	const {
		lineChar, title, titleAlign, align, lineColor,
	} = props

	let { width : widthPercent } = props
	if ( widthPercent < 1 || widthPercent > 100 ) widthPercent = 100

	const { columns } = terminalSize( )
	const width       = x100( columns, widthPercent )

	return box( '', {
		title       : title === '' ? undefined : title,
		borderStyle : {
			top         : lineChar,
			topLeft     : '',
			topRight    : '',
			left        : '',
			right       : '',
			bottomRight : '',
			bottomLeft  : '',
			bottom      : '',
		},
		dimBorder      : props.lineDim,
		borderColor    : lineColor,
		titleAlignment : titleAlign,
		float          : align,
		padding        : 0,
		margin         : 0,
		width          : width,
	} ).trimEnd()

}

/**
 * Generates a line with a title and customizable alignment for both the title and line.
 * @param {LineProps} props - Options object
 * @returns {string} Formatted line
 * @throws {Error} If `width` is not between 1 and 100
 */
export const line = ( props?: LineProps ): string => {

	let res = ''

	const {
		title = '',
		lineChar = '⎯',
		align = 'center',
		titleAlign = 'center',
		width = 100,
		lineColor,
		lineDim = false,
	} = props || {}

	const sharedProps = {
		align,
		width,
		lineColor,
		lineDim,
		titleAlign : titleAlign.replace( 'top-', '' ).replace( 'bottom-', '' ) as LineAlign,
	}
	if ( titleAlign.startsWith( 'bottom' ) ) {

		res += createLine( {
			lineChar,
			...sharedProps,
		} )
		// res = res.trim() + '\n'
		res += '\n'
		res += createLine( {
			title,
			lineChar : ' ',
			...sharedProps,
		} )

	}
	else if ( titleAlign.startsWith( 'top' ) ) {

		res += createLine( {
			title,
			lineChar : ' ',
			...sharedProps,
		} )
		res += '\n'
		res += createLine( {
			lineChar,
			...sharedProps,
		} )

	}
	else {

		res += createLine( {
			lineChar,
			title,
			...sharedProps,
		} )

	}

	return res

}
