
import stringWidth from 'string-width'

export const line = ( {
	title, lineChar = '⎯', align = 'center',
}: {
	title?    : string
	lineChar? : string
	align?    : 'left' | 'center' | 'right'
} ) => {

	const lineCharLength = stringWidth( lineChar )
	const totalWidth     = process.stdout.columns

	const textLength = title ? stringWidth( title ) : 0

	const width = Math.floor( ( totalWidth - textLength ) / ( 2 * lineCharLength ) )
	const line  = lineChar.repeat( width )

	if ( align === 'left' ) return title + line + line
	else if ( align === 'right' ) return line + line + title
	return line + title + line

}

