import {
	existsFile,
	getObjectFromJSONFile,
	joinPath,
	LazyLoader,
	readFile,
	writeFile,
} from '@dovenv/core/utils'

import { ConvertSuper } from '../_shared/main'

import type { TypescriptSharedProps } from './types'
import type { TypeDocOptions }        from 'typedoc'

const _typedocDeps = new LazyLoader( { typedoc: () => import( 'typedoc' ) } )
export class TypescriptSuper<Props extends TypescriptSharedProps> extends ConvertSuper<Props> {

	constructor( props: Props ) {

		super( props )
		this.props = props

	}

	protected async getTsConfigPath() {

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

	protected async getPackageJsonPath() {

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

	async runTypedoc<C extends Record<string, unknown>>( customConf?: C ) {

		const props    = this.props.opts || {}
		const tsConfig = await this.getTsConfigPath()
		const output   = this.props.output
		const {
			name,
			typedoc,
		} = props

		/**
		 * @see https://typedoc.org/documents/Options
		 */
		const config: Partial<TypeDocOptions> = {
			disableSources   : true,
			readme           : 'none',
			excludePrivate   : true,
			excludeProtected : true,
			// important for prevent namespace folder in output
			excludeExternals : true,
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

		if ( !name ) {

			const packageJson = await this.getPackageJsonPath()
			if ( packageJson ) {

				const pkg = await getObjectFromJSONFile( packageJson )

				if ( 'name' in pkg && typeof pkg.name === 'string' ) config.name = pkg.name

				//config.packageOptions == pkg

			}

		}
		else config.name = name

		const appConfig = {
			...config,
			...( typedoc ? typedoc : {} ),
			...customConf,
			entryPoints : typeof this.props.input === 'string' ? [ this.props.input ] : this.props.input,
			tsconfig    : tsConfig,

		}
		const {
			Application, TSConfigReader, RendererEvent,
		} = await _typedocDeps.get( 'typedoc' )
		const app       = await Application.bootstrapWithPlugins(
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

			console.debug( { outputPaths: paths } )
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
