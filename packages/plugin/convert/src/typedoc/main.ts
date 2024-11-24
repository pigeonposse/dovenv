/* eslint-disable @stylistic/object-curly-newline */
import {
	existsFile,
	getObjectFromJSONFile,
	joinPath,
	readFile,
	writeFile,
} from '@dovenv/utils'
import {
	Application,
	RendererEvent,
	TSConfigReader,
} from 'typedoc'

import { ConvertSuper } from '../_shared/main'

import type {
	ConvertPropsSuper,
	ConvertSuperInterface,
} from '../_shared/types'
import type { TypeDocOptions } from 'typedoc'
import type { PluginOptions }  from 'typedoc-plugin-markdown'

type TypedocOpts = Partial<Omit<TypeDocOptions, 'entryPoints' | 'tsconfig' | 'plugin' | 'out'>>
type PluginOpts = Partial<PluginOptions>

export type Typescript2MarkdownProps = ConvertPropsSuper & {
	/**
	 * Options
	 * @see https://dovenv.pigeonposse.com/guide/plugin/convert
	 */
	opts? : {
		/**
		 * __Cuaton tsconfig path__.
		 *
		 * Used for getting the ts config of the output.
		 * @default
		 * join( process.cwd(), "tsconfig.ts" )
		 */
		tsconfigPath?    : string
		/**
		 * __Package.json path__.
		 *
		 * This path is used to extract specific properties from the `package.json` file.
		 * @default
		 * join( process.cwd(), "package.json" )
		 */
		packageJsonPath? : string
		/**
		 * Name of your project.
		 */
		name?            : string
		/**
		 * Hooks.
		 */
		hooks?: {
			before? : ( ) => Promise<string> | string
			after?  : ( ) => Promise<string> | string
		}
		/**
		 * Transform function.
		 */
		transform?       : ( content: string ) => Promise<string>
		/**
		 * Typedoc options
		 * @see https://typedoc.org/options/
		 */
		typedoc?         : TypedocOpts
		/**
		 * Typedoc markdown options
		 * @see @see https://typedoc-plugin-markdown.org/docs/options
		 */
		typedocMarkdown? : PluginOpts
	} }

export class Typescript2Markdown  extends ConvertSuper<Typescript2MarkdownProps> implements ConvertSuperInterface {

	props

	constructor( props: Typescript2MarkdownProps ) {

		super( props )
		this.props = props

	}

	async #getTsConfigPath() {

		const propsPath     = this.props.opts?.tsconfigPath
		const currentPath   = joinPath( process.cwd(), 'tsconfig.json' )
		const existTsConfig = async ( path: string ) => {

			const exists = await existsFile( path )
			if ( exists ) return true
			console.warn( `Could not find tsconfig.json at ${path}` )
			return false

		}
		return propsPath && await existTsConfig( propsPath )
			? propsPath
			: await existTsConfig( currentPath )
				? currentPath
				: undefined

	}

	async #getPackageJsonPath() {

		const propsPath     = this.props.opts?.packageJsonPath
		const currentPath   = joinPath( process.cwd(), 'package.json' )
		const existTsConfig = async ( path: string ) => {

			const exists = await existsFile( path )
			if ( exists ) return true
			console.warn( `Could not find package.json at ${path}` )
			return false

		}
		return propsPath && await existTsConfig( propsPath )
			? propsPath
			: await existTsConfig( currentPath )
				? currentPath
				: undefined

	}

	async run() {

		const props    = this.props.opts || {}
		const tsConfig = await this.#getTsConfigPath()
		const output   = this.props.output
		const {
			name,
			typedoc,
			typedocMarkdown,
		} = props

		const config: Partial<TypeDocOptions> = {
			disableSources   : true,
			readme           : 'none',
			excludePrivate   : true,
			excludeProtected : true,
			groupOrder       : [
				'Classes',
				'Functions',
				'Type Aliases',
				'*',
			],
			includeVersion : typedoc?.includeVersion,
			// frontmatter
			// frontmatterGlobals    : { outline: [ 2, 5 ] },

		}

		/**
		 * markdown.
		 * @see https://typedoc-plugin-markdown.org/docs/options
		 */
		const configMD: Partial<PluginOptions> = {
			entryFileName         : 'index',
			fileExtension         : '.md',
			outputFileStrategy    : 'modules',
			flattenOutputFiles    : false,
			useCodeBlocks         : true,
			expandObjects         : true,
			expandParameters      : true,
			// hidePageHeader        : true,
			// hidePageTitle         : true,
			// hideGroupHeadings     : true,
			indexFormat           : 'list',
			classPropertiesFormat : 'table',
			typeDeclarationFormat : 'table',
			parametersFormat      : 'table',

		}

		if ( !name ) {

			const packageJson = await this.#getPackageJsonPath()
			if ( packageJson ) {

				const pkg = await getObjectFromJSONFile( packageJson )

				if ( 'name' in pkg && typeof pkg.name === 'string' ) config.name = pkg.name

				//config.packageOptions == pkg

			}

		}
		else config.name = name

		const appConfig = {
			...config,
			...configMD,
			...( typedoc ? typedoc : {} ),
			...( typedocMarkdown ? typedocMarkdown : {} ),
			plugin      : [ 'typedoc-plugin-markdown' ],
			entryPoints : typeof this.props.input === 'string' ? [ this.props.input ] : this.props.input,
			tsconfig    : tsConfig,

		}

		const app = await Application.bootstrapWithPlugins(
			appConfig,
			tsConfig ? [ new TSConfigReader() ] : undefined,
		)

		const project = await app.convert()
		const out     = await this._getOutput()
		const dir     = out.dir

		console.debug( {
			appConfig,
			dir,
		} )

		if ( project ) {

			// eslint-disable-next-line prefer-const
			let paths: string[] = []
			app.renderer.on( RendererEvent.END, event => {

				if ( event.outputDirectory && event.urls ) {

					const outputDir = event.outputDirectory
					for ( const outputFile of event.urls ) {

						const filePath = joinPath( outputDir, outputFile.url )
						paths.push( filePath )

					}

				}

			} )

			await app.generateDocs( project, dir )

			console.debug( {
				outputPaths : paths,
			} )
			const res = []
			for ( const path of paths ) {

				const preContent                = await readFile( path, 'utf-8' )
				let content: string | undefined = undefined
				if ( props?.hooks?.before ) {

					const hookContent = await props.hooks.before()
					if ( hookContent && typeof hookContent === 'string' && hookContent !== '' ) {

						if ( !content ) content = preContent
						content = hookContent + content

					}

				}
				if ( props?.hooks?.after ) {

					const hookContent = await props.hooks.after()
					if ( hookContent && typeof hookContent === 'string' && hookContent !== '' ) {

						if ( !content ) content = preContent
						content += hookContent

					}

				}
				if ( props?.transform ) {

					const transformedRes = await props.transform( preContent )
					if ( transformedRes && typeof transformedRes === 'string' && transformedRes !== '' ) {

						if ( !content ) content = preContent
						content = transformedRes

					}

				}

				if ( !content ) content = preContent
				else if ( output ) await writeFile(
					path,
					content,
				)

				res.push( {
					id : path,
					content,
				} )

			}

			await out.rmTempIfExist()
			return res

		}

		throw new Error( 'Inputs not converted' )

	}

}
