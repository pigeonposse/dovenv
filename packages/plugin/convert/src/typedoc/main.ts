import {
	existsFile,
	getObjectFromJSONFile,
	getPaths,
	joinPath,
	readFile,
} from '@dovenv/utils'
import {
	Application,
	TSConfigReader,
} from 'typedoc'

import { ConvertSuper } from '../_shared/main'

import type {
	ConvertPropsSuper,
	ConvertSuperInterface,
} from '../_shared/types'
import type { TypeDocOptions } from 'typedoc'
import type { PluginOptions }  from 'typedoc-plugin-markdown'

type UserProps = {
	tsconfigPath?    : string
	packageJsonPath? : string
	name?            : string
}
type TypedocOpts = Partial<Omit<TypeDocOptions, 'entryPoints' | 'tsconfig' | 'plugin' | 'out'>>
type PluginOpts = Partial<PluginOptions>

export type Typescript2MarkdownProps = ConvertPropsSuper & { opts?: UserProps & TypedocOpts & PluginOpts }

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
			console.warn( `Could not find tsconfig.json at ${path}` )
			return false

		}
		return propsPath && await existTsConfig( propsPath )
			? propsPath
			: await existTsConfig( currentPath )
				? currentPath
				: undefined

	}

	async run() {

		const tsConfig = await this.#getTsConfigPath()

		const {
			tsconfigPath,
			packageJsonPath,
			name,
			...opts
		} = this.props.opts || {}

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
			includeVersion : this.props.opts?.includeVersion,
			// frontmatter
			// frontmatterGlobals    : { outline: [ 2, 5 ] },

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

		/**
		 * markdown.
		 * @see https://typedoc-plugin-markdown.org/docs/options
		 */
		const configMD: Partial<PluginOptions> = {
			entryFileName         : 'index',
			hidePageHeader        : true,
			hidePageTitle         : true,
			useCodeBlocks         : true,
			expandObjects         : true,
			indexFormat           : 'list',
			classPropertiesFormat : 'table',
			typeDeclarationFormat : 'table',
			parametersFormat      : 'table',
			// hideGroupHeadings     : true,
			outputFileStrategy    : 'modules',
			expandParameters      : true,
			flattenOutputFiles    : false,
		}

		const mergedConfig = {
			...opts ?? {},
			...config,
			...configMD,
		}

		const app = await Application.bootstrapWithPlugins(
			{
				...mergedConfig,
				plugin      : [ 'typedoc-plugin-markdown' ],
				entryPoints : typeof this.props.input === 'string' ? [ this.props.input ] : this.props.input,
				tsconfig    : tsConfig,

			},
			tsConfig ? [ new TSConfigReader() ] : undefined,
		)

		// load( app )

		const project = await app.convert()
		const out     = await this._getOutput()
		const dir     = out.dir

		if ( project ) {

			await app.generateDocs( project, dir )
			const paths = await getPaths( dir )
			const res   = []
			for ( const path of paths ) {

				const content = await readFile( path, 'utf-8' )

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
