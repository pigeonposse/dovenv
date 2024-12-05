
import {
	getExtName,
	getMatch,
	getPaths,
	readFile,
	relativePath,
	writeFile,
	process,
} from '@dovenv/core/utils'
import {
	parse,
	report,
} from 'leasot'

import type { Config }      from './types'
import type { TodoComment } from 'leasot/dist/definitions'

export class Todo {

	constructor( public config?: Config ) {}

	async get( key?: string[] ) {

		const conf = this.config
		if ( !conf ) {

			console.warn( 'No TODO config provided in your configuration' )
			return

		}

		const availableKeys      = Object.keys( conf )
		const currKeys           = ( !key ) ? availableKeys : getMatch( availableKeys, key  )
		const res: TodoComment[] = []
		for ( const key of currKeys ) {

			console.info( `TODOs for [${key}]` )
			const opts  = conf[key]
			const paths = await getPaths( opts.input, opts.inputOpts )

			for ( const path of paths ) {

				const content  = await readFile( path, 'utf-8' )
				const filetype = getExtName( path )

				const todos = parse( content, {
					filename   : relativePath( process.cwd(), path ),
					extension  : filetype,
					customTags : ( opts.customTags
						? opts.customTags
						: [
							'TODO',
							'@todo',
							'@fixme',
							'- [ ]',
							'- [x]',
						] ),
				} )

				if ( todos.length === 0 ) continue

				res.push( ...todos )

			}

			if ( res.length > 0 && opts.output ) {

				const output = report( res, 'markdown', { padding: 2 } )
				await writeFile( opts.output, output, 'utf-8' )

			}

		}
		if ( res.length === 0 ) console.log( 'No TODOs found' )
		return res

	}

	async run( key?: string[] ) {

		const todos = await this.get( key )
		if ( !todos ) return
		const output = report( todos, 'table', { padding: 2 } )
		if ( output || output.length > 0 )
			console.log( output )

	}

}
