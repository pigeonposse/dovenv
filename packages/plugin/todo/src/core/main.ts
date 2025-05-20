/**
 * TODO CORE.
 *
 * Looks for todos in comments in diferent fyle types.
 *
 * @todo Fix for accept "- [ ]" as custom tag without comments.
 */
import {
	writeFile,
	getDirName,
	ensureDir,
	readFiles,
} from '@dovenv/core/utils'

import { homepage } from '../../package.json'

import type { Config }       from './types'
import type { CommandUtils } from '@dovenv/core'

type TodoComment = {
	file : string
	line : number
	text : string
	tag  : string
}

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

	async #extractTodos( content: string, path: string, tags: string[] ): Promise<TodoComment[]> {

		const tagRegex = new RegExp( `(${tags.map( t => t.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ) ).join( '|' )})`, 'i' )

		const todos = await Promise.all( content.split( '\n' ).map( async ( line, i ) => {

			const match = tagRegex.exec( line )
			if ( match ) return {
				file : path,
				line : i + 1,
				text : line.replace( match[0], '' ).trim(),
				tag  : match[0],
			}
			else return

		} ) )

		return todos.filter( v => v !== undefined )

	}

	#formatMarkdown( todos: TodoComment[] ): string {

		return todos.map( todo =>
			`- **${todo.file}:${todo.line}** — ${todo.text}` ).join( '\n' )

	}

	#formatCli( todos: TodoComment[] ): string {

		const table =   todos.map( todo => this.utils.style.table( [
			[ this.utils.style.section.b( 'tag ' ), todo.tag ],
			[ this.utils.style.section.b( 'description ' ), todo.text ],
			[ this.utils.style.section.b( 'path ' ), this.utils.style.p( todo.file + ':' + todo.line ) ],
		], { chars : {
			'top'          : '',
			'top-mid'      : '',
			'top-left'     : '',
			'top-right'    : '',
			'bottom'       : '',
			'bottom-mid'   : '',
			'bottom-left'  : '',
			'bottom-right' : '',
			'left'         : '',
			'left-mid'     : '',
			'mid'          : '',
			'mid-mid'      : '',
			'right'        : '',
			'right-mid'    : '',
			'middle'       : '',
		} } ) )

		return table.join( '\n\n' )

	}

	async #fn( pattern?: string[] ): Promise<TodoComment[] | undefined> {

		// const defaultType             = '.md'
		const defaultTags             = [
			'@todo',
			'@fixme',
			'- [ ]',
		]
		const resTotal: TodoComment[] = []

		await this.utils.mapOpts( {
			input : this.opts,
			pattern,
			cb    : async ( {
				value, log,
			} ) => {

				const res: TodoComment[] = []

				await readFiles( value.input, {
					inputOpts : {
						gitignore : true,
						onlyFiles : true,
						dot       : true,
						cwd       : this.utils.wsDir,
						...value.inputOpts,
					},
					hook : { onFile : async ( {
						path, content,
					} ) => {

						// const filetype = getExtName( path )

						const tags = value.customTags ?? defaultTags

						const todos = await this.#extractTodos( content, path, tags )

						if ( todos.length > 0 ) res.push( ...todos )

					} },
				} )

				if ( res.length > 0 && value.output ) {

					const output = this.#formatMarkdown( res )
					const outDir = getDirName( value.output )
					await ensureDir( outDir )
					await writeFile( value.output, output, 'utf-8' )

				}

				if ( res.length > 0 ) {

					const output =  this.#formatCli( res )

					if ( output && output.length > 0 ) {

						log.info( 'TODOs found' )
						console.log( '\n' + output + '\n' )

					}

				}

				if ( res.length === 0 ) log.info( 'No TODOs found' )
				else resTotal.push( ...res )

			},
		} )

		return resTotal

	}

	async run( pattern?: string[] ): Promise<TodoComment[] | undefined> {

		return await this.utils.catchFn( this.#fn( pattern ) )

	}

}
