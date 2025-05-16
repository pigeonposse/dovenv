/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-returns-type */

import { CommandUtils } from '@dovenv/core'
import {
	deepmergeCustom,
	ensureDir,
	getBaseName,
	getDirName,
	getExtName,
	getObjectFrom,
	getPaths,
	getStringFrom,
	getStringType,
	joinPath,
	LazyLoader,
	relativePath,
	writeFile,
} from '@dovenv/core/utils'

import * as consts  from './const'
import { schema }   from './schema'
import { homepage } from '../package.json'

import type {
	Config,
	ExampleConfigFileProps,
	ExampleCustomProps,
	ExampleJsdocProps,
	ExampleMultipleProps,
	ExamplePathProps,
} from './types'
import type { Any } from '@dovenv/core/utils'

type ExampleConfig = NonNullable<ExampleConfigFileProps['config']>
// @ts-ignore
const _deps = new LazyLoader( { jsdoc: async () => ( await import( 'jsdoc-api' ) ).default as Any } )
export class Examples {

	const = consts
	protected utils : CommandUtils
	opts            : Config | undefined

	constructor( data:{
		opts? : Config
		utils : CommandUtils
	} ) {

		this.utils         = data.utils
		this.opts          = data.opts
		this.utils.helpURL = homepage
		this.utils.title   = 'examples'

	}

	async #setOutput( content:string, output?: string ) {

		if ( !output ) return

		await ensureDir( getDirName( output ) )
		await writeFile( output, content )

	}

	#createExampleTitle( data: {
		title? : string | false
		desc?  : string
	} ) {

		const {
			title = 'Examples',
			desc,
		} = data

		let res = ''

		if ( title ) res += `# ${title}\n\n`
		if ( desc ) res += `${desc}\n\n`
		return res

	}

	async #createExampleContent( props: {
		data         : ExampleConfig[number]['data']
		header?      : number
		step?        : string
		path?        : string
		contentType? : ReturnType<typeof getStringType>
	} ) {

		const {
			data,
			header = 2,
			path = this.utils.process.cwd(),
			step = '\n\n',
		} = props

		const h = '#'.repeat( header ) + ' '
		let res = ''

		for ( const [ k, v ] of Object.entries( data ) ) {

			const contentType = props.contentType || getStringType( v.input )

			const desc    = v.desc ? v.desc + step : ''
			const outro   = v.outro ? step + v.outro : ''
			const title   = ( v.title || ( contentType === 'path' ? getBaseName( v.input ) : k ) ) + step
			const type    = v.type || ( contentType === 'path' ? getExtName( v.input ).replace( '.', '' ) : 'markdown' )
			const content = await getStringFrom( contentType === 'path' ? joinPath( path, v.input ) : v.input )
			res          += `${h}${title}${desc}\`\`\`${type}\n${content}\n\`\`\`${outro}${step}`

		}
		return res

	}

	async #createExample( data: ExampleConfig, path?: string, more?: {
		title? : string | false
		desc?  : string
	} ) {

		const step = '\n\n'

		let res = this.#createExampleTitle( more || {} )

		for ( const [ key, value ] of Object.entries( data ) ) {

			const title = ( value.title || key ) + step
			const desc  = value.desc ? value.desc + step : ''
			const outro = value.outro ? step + value.outro : ''

			const dataRes = value.data
				? ( await this.#createExampleContent( {
					data   : value.data,
					header : 3,
					path,
				} ) )
				: ''

			res += `## ${title}${desc}${dataRes}${outro}${step}`

		}

		return res

	}

	async #fn( pattern?: string[] ) {

		const keys = await this.utils.getOptsKeys( {
			input : this.opts,
			pattern,
		} )
		if ( !keys || !this.opts ) return

		const res: Record<string, string> = {}
		const { style }                   = this.utils

		for ( const key of keys ) {

			const opt = this.opts[key]
			console.log( style.info.h( `Example for ${style.badge( key )} key` ) )
			res[key] = await this.get( opt )
			console.log( '\n', style.success.msg( ` ✨ Successful!` ), '\n' )

		}
		return res

	}

	async fromConfig( data: ExampleConfigFileProps ) {

		const {
			input,
			config: overrideConf,
			title,
			desc,
			output,
		} = data

		const merge     = deepmergeCustom<ExampleConfig>( {} )
		const inputCong = typeof input === 'string' ? await getObjectFrom<ExampleConfig>( input ) : input
		const config    = merge( inputCong, overrideConf || {} )
		const path      = typeof input === 'string' ? getDirName( input ) : this.utils.process.cwd()

		await this.utils.validateSchema( schema, config, { showValid: true } )

		const res = await this.#createExample( config, path, {
			title,
			desc,
		} )

		await this.#setOutput( res, output )
		return res

	}

	async fromPath( data:ExamplePathProps ) {

		const {
			output, title, desc, input, opts,
		} = data

		const paths = await getPaths( input, opts )

		const dataRes: ExampleConfig[number]['data'] = {}

		for ( const path of paths ) {

			dataRes[path] = { input: path }

		}

		let res = this.#createExampleTitle( {
			title,
			desc,
		} )

		res += await this.#createExampleContent( {
			data        : dataRes,
			path        : opts?.cwd?.toString(),
			contentType : 'path',
		} )

		await this.#setOutput( res, output )
		return res

	}

	/**
	 * Process jsdoc examples.
	 *
	 * @param data - Example data.
	 * @returns    Resolved example content.
	 * @see https://github.com/jsdoc2md/jsdoc-api/blob/master/docs/api.md
	 */
	async fromJsdoc( data:ExampleJsdocProps ) {

		interface Value {
			examples : string
			meta : {
				path     : string
				filename : string
			}
			name?        : string
			description? : string
		}

		const {
			output, input, title, desc,
		} = data

		console.debug( { data } )
		const jsdoc     = await _deps.get( 'jsdoc' )
		const jsdocData = await jsdoc.explain( {
			files : input.map( p => relativePath( this.utils.process.cwd(), p ) ),
			cache : false,
		} ) as Value[]

		console.debug( { jsdocData } )

		const examples = jsdocData.filter( doc => doc.examples )
			.map( doc => ( {
				title : doc.name || doc.meta.filename,
				input : doc.examples,
				desc  : doc.description,
				type  : getExtName( doc.meta.path ).replace( '.', '' ) || 'ts',
			} ) ).reduce( ( acc, example ) => {

				// @ts-ignore
				acc[example.title] = example
				return acc

			}, {} as ExampleConfig[number]['data'] )

		const content = await this.#createExampleContent( { data: examples } )
		if ( !content || content.trim() == '' ) {

			console.log()
			console.warn( this.utils.style.warn.msg( 'No JSODC examples retrived' ) )
			return ''

		}

		const res = this.#createExampleTitle( {
			title,
			desc,
		} ) + content

		await this.#setOutput( res, output )
		return res

	}

	/**
	 * Process multiple examples.
	 *
	 * @param data - Example data.
	 * @returns    Resolved example content.
	 */
	async fromMultiple( data: ExampleMultipleProps ) {

		const {
			output, title, desc, ...props
		} = data

		let res = this.#createExampleTitle( {
			title,
			desc,
		} )

		if ( !props ) throw new Error( 'No input found for any type.' )
		if ( props.config ) res += await this.fromConfig( {
			title : false,
			...props.config,
		} )
		if ( props.jsdoc ) res += await this.fromJsdoc( {
			title : false,
			...props.jsdoc,
		} )
		if ( props.path ) res += await this.fromPath( {
			title : false,
			...props.path,
		} )

		await this.#setOutput( res, output )
		return res

	}

	/**
	 * Processes custom example data using provided handlers.
	 *
	 * This method allows dynamic processing of example data based on the type
	 * by binding specific handler functions for each type. The function received
	 * in the data parameter is invoked with an object containing these handlers.
	 *
	 * @param data - Object containing the function to execute with the handlers.
	 * @returns    A promise that resolves to the result of the executed function.
	 */
	async fromCustom( data: ExampleCustomProps ) {

		const T = this.const.TYPE

		return await data.fn( {
			config : this.utils.config || {},
			run    : {
				[T.CONFIG]   : this.fromConfig.bind( this ),
				[T.PATH]     : this.fromPath.bind( this ),
				[T.JSDOC]    : this.fromJsdoc.bind( this ),
				[T.MULTIPLE] : this.fromMultiple.bind( this ),
			},
		} )

	}

	/**
	 * Get a custom Example content template.
	 *
	 * Perfect method to be used outside an `Dovenv` environment.
	 *
	 * @param data - Configuration object.
	 * @returns    A promise that resolves to the processed content as a string.
	 */
	async get( data: Config[number] ) {

		const T = this.const.TYPE
		const {
			type, ...props
		} = data

		const handlers: Record<typeof T[keyof typeof T], ( props: Any ) => Promise<Any>> = {
			[T.CONFIG]   : this.fromConfig.bind( this ),
			[T.PATH]     : this.fromPath.bind( this ),
			[T.JSDOC]    : this.fromJsdoc.bind( this ),
			[T.MULTIPLE] : this.fromMultiple.bind( this ),
			[T.CUSTOM]   : this.fromCustom.bind( this ),
		}

		if ( handlers[type] ) return await handlers[type]( props )

		throw new Error( 'You needd to set one type: ' + Object.values( T ).join( ', ' ) )

	}

	/**
	 * Process examples from the configuration object.
	 *
	 * @param pattern - An array of examples names to process. If not provided, all examples will be processed.
	 * @returns       A promise that resolves to an object containing the content of each processed example.
	 */
	async run( pattern?: string[] ) {

		return await this.utils.catchFn( this.#fn( pattern ) )

	}

}
