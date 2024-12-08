/**
 * TODO CORE.
 *
 * looks for todos in comments in diferent fyle types.
 * @todo fix for accept "- [ ]" as custom tag without comments
 */
import { PluginCore } from '@dovenv/core'
import {
	getExtName,
	getMatch,
	getPaths,
	readFile,
	relativePath,
	writeFile,
	process,
	getDirName,
	ensureDir,
} from '@dovenv/core/utils'
import {
	isExtensionSupported,
	parse,
	report,
} from 'leasot'

import type { Config } from './types'

type TodoComments = Awaited<ReturnType<typeof parse>>

export class Todo extends PluginCore {

	constructor( public config?: Config ) {

		super()

	}

	async get( key?: string[] ): Promise<TodoComments | undefined> {

		const conf = this.config
		if ( !conf ) {

			console.warn( 'No TODO config provided in your configuration' )
			return

		}

		const defaultType            = '.md'
		const availableKeys          = Object.keys( conf )
		const currKeys               = ( !key ) ? availableKeys : getMatch( availableKeys, key  )
		const resTotal: TodoComments = []

		for ( const key of currKeys ) {

			const res: TodoComments = []
			console.log( '\n' + this.style.get.section( `TODOs for ${this.style.get.badge( key )} key` ) )

			const opts  = conf[key]
			const paths = await getPaths( opts.input, {
				gitignore : true,
				onlyFiles : true,
				dot       : true,
				...opts.inputOpts,
			} )

			console.debug( { paths } )

			for ( const path of paths ) {

				const content = await readFile( path, 'utf-8' )
				let filetype  = getExtName( path )

				// if ( !filetype ) console.warn( 'path has no file type', path )

				const fileTypeSupported = isExtensionSupported( filetype )
				if ( !fileTypeSupported ) {

					console.warn( 'path has invalid file type', path )
					filetype = defaultType

				}
				const todos = await parse( content, {
					filename   : relativePath( process.cwd(), path ),
					extension  : filetype || defaultType,
					customTags : ( opts.customTags
						? opts.customTags
						: [
							'TODO',
							'@todo',
							'@fixme',
							'- [ ]',
						] ),
				} )

				if ( todos.length === 0 ) continue

				res.push( ...todos )

			}

			if ( res.length > 0 && opts.output ) {

				const output = await report( res, 'markdown', { padding: 2 } )
				const outDir = getDirName( opts.output )
				await ensureDir( outDir )
				await writeFile( opts.output, output, 'utf-8' )

			}

			if ( res.length > 0 ) {

				const output = await report( res, 'table', { padding: 2 } )

				if ( output && output.length > 0 )
					console.log( output )

			}

			if ( res.length === 0 ) console.log(  '\n' + this.style.get.error( 'No TODOs found' ) )
			else resTotal.push( ...res )

		}

		return resTotal

	}

	async run( key?: string[] ) {

		try {

			await this.get( key )

		}
		catch ( e ) {

			console.log()
			console.log( this.style.get.error( e instanceof Error ? e.message : e ) )

		}

	}

}
