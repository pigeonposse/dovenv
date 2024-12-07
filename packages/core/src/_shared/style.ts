import {
	color,
	icon,
	table,
	box,
	line,
} from '@dovenv/utils'

export class CommandStyle {

	color : typeof color = color
	line  : typeof line = line
	icon  : typeof icon = icon

	get = {
		title        : ( v:unknown ) => color.magenta.bold( icon.triangleRightSmall ) + ' ' + color.magenta( this.get.badge(  v ) ),
		desc         : ( v:unknown ) => color.magenta.dim( v ),
		// section
		sectionTitle : ( v:unknown ) =>  color.cyan.bold( icon.triangleRightSmall ) + ' ' + color.cyan( v ),
		sectionDesc  : ( v:unknown ) => color.cyan.dim( v ),
		section      : ( v:unknown,  msg?:unknown ) => this.get.sectionTitle( v )  + ( msg ? '\n' + this.get.sectionDesc( msg ) : '' ),
		// list
		listKey      : ( v:unknown ) => color.magenta( icon.bullet + ' ' + v ),
		listValue    : ( v:unknown ) => color.dim.gray( v ),
		listSucced   : ( [ k, v ]:[string, unknown] ) => [ k, color.green( v ) ],
		// error
		error        : ( v:unknown ) => color.red( icon.cross + ' ' + v ),
		// succed
		succedTitle  : ( v:unknown ) => color.green( icon.tick + ' ' + v ),
		succedDesc   : ( v:unknown ) => color.green.dim( v ),
		succed       : ( t:string, msg?:unknown ) => this.get.succedTitle( t ) + ( msg ? '\n' + this.get.succedDesc( msg ) : '' ),
		// others
		text         : ( v:unknown ) => color.gray.dim( v ),
		link         : ( msg: string ) => color.italic.underline(  msg ),
		badge        : ( msg: unknown ) => color.inverse( ' ' + msg + ' ' ),
		bold         : ( msg: unknown ) => color.bold( msg ),
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
		line( title?: string, c?: NonNullable<Parameters<typeof line>[0]>['lineColor'] ) {

			return `\n${line( {
				title     : title ? color.inverse( ' ' + title + ' ' ) : undefined,
				lineColor : c || 'gray',
				lineChar  : icon.line,
			} )}\n`

		},
		// line( title?: string ) {

		// 	return {
		// 		start : () => {

		// 			console.log( `\n${line( {
		// 				title     : color.gray.inverse( ' ' + title + ' ' ),
		// 				lineColor : 'gray',
		// 				lineChar  : icon.line,
		// 			} )}\n` )

		// 		},
		// 		stop : () => {

		// 			console.log( `\n${line( {
		// 				lineChar  : icon.line,
		// 				lineColor : 'gray',
		// 			} )}\n` )

		// 		},
		// 	}

		// },

	}

	onDebug = ( ...args: Parameters<typeof console.debug> ) => {

		console.log( '\n' + line( {
			title      : 'DEBUG',
			lineColor  : 'gray',
			titleAlign : 'top-center',
			lineDim    : true,
		} )  )
		console.log( ...args )
		console.log( line( {
			title     : '',
			lineColor : 'gray',
			lineDim   : true,
		} ) + '\n' )

	}

	// setTitle( title: string ) {

	// 	console.log( this.get.title( title ) + '\n' )

	// }

	// setSuccedMsg( title: string, msg?: string ) {

	// 	console.log( this.get.succed( title, msg ) )

	// }

	// setSectionTitle( title: string ) {

	// 	console.log()
	// 	console.info( this.get.sectionTitle( title ) )

	// }

	// setListItem( title: string, desc: unknown ) {

	// 	console.log( this.get.listKey(  title + ' ' )  + this.get.listValue( desc ) )

	// }

	// setList( list: ( [string, unknown] )[] ) {

	// 	for ( const [ k, v ] of list ) this.setListItem( k, v )

	// }

}
