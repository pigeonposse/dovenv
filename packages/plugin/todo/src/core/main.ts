/**
 * TODO CORE.
 *
 * Looks for todos in comments in diferent fyle types.
 *
 * @todo Fix for accept "- [ ]" as custom tag without comments.
 */
import {
	getExtName,
	getPaths,
	readFile,
	relativePath,
	writeFile,
	getDirName,
	ensureDir,
} from '@dovenv/core/utils'
import {
	isExtensionSupported,
	parse,
	report,
} from 'leasot'

import { homepage } from '../../package.json'

import type { Config }       from './types'
import type { CommandUtils } from '@dovenv/core'

type TodoComments = Awaited<ReturnType<typeof parse>>

export class Todo {

	opts  : Config | undefined
	utils : CommandUtils

	constructor( {
		opts, utils,
	}:{
		opts? : Config
		utils : CommandUtils
	} ) {

		this.opts          = opts
		this.utils         = utils
		this.utils.helpURL = homepage
		this.utils.title   = 'todo'

	}

	async #fn( pattern?: string[] ): Promise<TodoComments | undefined> {

		const keys = await this.utils.getOptsKeys( {
			input : this.opts,
			pattern,
		} )
		if ( !keys || !this.opts ) return

		const defaultType            = '.md'
		const resTotal: TodoComments = []

		for ( const key of keys ) {

			const res: TodoComments = []
			console.log( '\n' + this.utils.style.info.h( `TODOs for ${this.utils.style.badge( key )} key` ) )

			const opts  = this.opts[key]
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
					filename   : relativePath( this.utils.process.cwd(), path ),
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

			if ( res.length === 0 ) console.log( '\n' + this.utils.style.error.msg( 'No TODOs found' ) )
			else resTotal.push( ...res )

		}

		return resTotal

	}

	async run( pattern?: string[] ): Promise<TodoComments | undefined> {

		return await this.utils.catchFn( this.#fn( pattern ) )

	}

}
