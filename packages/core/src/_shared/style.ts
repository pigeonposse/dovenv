import {
	color,
	icon,
	table,
	box,
	// line,
} from '@dovenv/utils'

export class CommandStyle {

	color : typeof color = color

	get = {
		title        : ( v:unknown ) => color.bgMagenta( ' ' + v + ' ' ),
		sectionTitle : ( v:unknown ) => color.cyanBright( v ),
		desc         : ( v:unknown ) => color.magenta( v ),
		listKey      : ( v:unknown ) => color.magenta( icon.bullet + ' ' + v ),
		listValue    : ( v:unknown ) => color.dim.gray( v ),
		listSucced   : ( [ k, v ]:[string, unknown] ) => [ k, color.green( v ) ],
		error        : ( v:unknown ) => color.red( icon.cross + ' ' + v ),
		errorPoint   : ( v:unknown ) => color.red( icon.bullet + ' ' + v ),
		succed       : ( v:unknown ) => color.green( icon.tick + ' ' + v ),
		table( data: Parameters<typeof table>[0], opts?: Parameters<typeof table>[1] ) {

			return table(
				data,
				{
					drawHorizontalLine : () => false,
					drawVerticalLine   : () => false,
					...( opts || {} ),
				},
			)

		},
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

		},
	}

	setTitle( title: string ) {

		console.log( this.get.title( title ) + '\n' )

	}

	setSuccedMsg( title: string ) {

		console.log( this.get.succed( title ) )

	}

	setSectionTitle( title: string ) {

		console.log()
		console.info( this.get.sectionTitle( title ) )

	}

	setListItem( title: string, desc: unknown ) {

		console.log( this.get.listKey(  title + ' ' )  + this.get.listValue( desc ) )

	}

	setList( list: ( [string, unknown] )[] ) {

		for ( const [ k, v ] of list ) this.setListItem( k, v )

	}

}
