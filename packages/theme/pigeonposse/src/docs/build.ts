import {
	defineConfig,
	PluginCore,
} from '@dovenv/core'
import {
	yaml,
	joinPath,
	writeFile,
	ensureDir,
	joinUrl,
	existsFile,
	geMDTocString,
	color,
	capitalize,
	deepmerge,
	readFile,
} from '@dovenv/core/utils'
import {
	templates,
	examples,
	convert,
} from '@dovenv/theme-banda'

import {
	docsRoute,
	FILE_NAME,
	ICON,
	ID,
	TYPE,
} from './const'
import * as partial      from './partials'
import * as template     from './templates'
import {
	getPublicPackageByType,
	getPublicPackageData,
} from './utils'

import type { PkgData } from './utils'
import type { Config }  from '@dovenv/core'
import type {
	ObjectValues,
	PackageJSON,
	Prettify,
} from '@dovenv/core/utils'

type PredocsConfig = undefined
type Type = Prettify<ObjectValues<typeof TYPE>>

export class Predocs extends PluginCore<PredocsConfig> {

	#examples
	#templates
	#convert
	#pkgData  : PkgData | undefined
	#wsPkg
	#corePkg
	#pkgPaths : string[] | undefined
	#coreDir
	#REPO_URL
	projectName
	#mdInfo: undefined | {
		more   : string
		plugin : string
		theme  : string
		config : string
		lib    : string
	}

	title = 'Predocs'

	protected getLogTitle

	constructor( opts: PredocsConfig, config?: Config ) {

		super( opts, config )

		const { Examples }  = examples
		const { Templates } = templates
		const { Convert }   = convert

		this.#examples  = new Examples( undefined, config )
		this.#templates = new Templates( undefined, config )
		this.#convert   = new Convert(  )
		this.#pkgData   = undefined
		this.#wsPkg     = ( this.pkg || {} ) as PackageJSON
		this.#corePkg   = ( config?.const?.corePkg || config?.const?.pkg ) as PackageJSON
		this.#coreDir   = config?.const?.coreDir as string || joinPath( this.wsDir, 'packages', 'core' )
		this.#REPO_URL  = config?.const?.REPO_URL as string

		this.projectName = this.#wsPkg.extra.productName || this.#wsPkg.extra.id || this.#wsPkg.name
		this.getLogTitle = ( t: string ) => `${color.inverse( ` ${t} ` )}\n`

	}

	async #getPkgPaths(): Promise<string[]> {

		if ( this.#pkgPaths ) return this.#pkgPaths

		return await this.getPkgPaths()

	}

	async #getPublicPkgData(): Promise<PkgData> {

		if ( this.#pkgData ) return this.#pkgData

		const pkgPaths = await this.#getPkgPaths()
		const data     = await getPublicPackageData( pkgPaths, this.wsDir, this.#wsPkg )

		return await data

	}

	async getMarkdownInfo() {

		if ( this.#mdInfo ) return this.#mdInfo

		const data             = await this.#getPublicPkgData()
		const publicPkgGrouped = getPublicPackageByType( data.data )

		const res = {
			more          : '## More\n\n',
			[TYPE.plugin] : `## ${ICON[TYPE.plugin]} Plugins\n\n`,
			[TYPE.theme]  : `## ${ICON[TYPE.theme]} Themes\n\n`,
			[TYPE.config] : `## ${ICON[TYPE.config]} Config\n\n`,
			[TYPE.lib]    : `## Other tools\n\n`,
		}

		for ( const [ type, items ] of Object.entries( publicPkgGrouped ) ) {

			if ( !Array.isArray( items ) || !items.length ) continue

			if ( type === TYPE.lib ) {

				for ( const item of items ) {

					res.more += `- [${capitalize( item.id )}](${joinUrl( data.url, data.urlGuidePath, item.id )})\n`

				}

			}
			else {

				const title = capitalize( type ) + ( type === TYPE.plugin ? 's' : '' )
				res.more   += `- [${title}](${joinUrl( data.url, data.urlGuidePath, type )})\n`

				for ( const item of items ) {

					res[type as keyof typeof res] += `## ${capitalize( item.id )}\n\n${item.data.description}\n\n- [Read more](${item.docs.urlPath.index})\n\n`
					res.more                      += `  - [${capitalize( item.id )}](${joinUrl( data.url, item.docs.urlPath.index )})\n`

				}

			}

		}

		this.#mdInfo = res
		return res

	}

	async setIndexFile( config?: {
		custom?           : Record<string, unknown>
		noFeatures?       : boolean
		noAction?         : boolean
		content?          : string
		/** Change template to `creation` template */
		creationTemplate? : boolean
	} ) {

		console.info( this.getLogTitle( 'index file' ) )
		const data          = await this.#getPublicPkgData()
		const docsIndexFile = joinPath( data.docsDir, FILE_NAME.INDEX )

		await this.#templates.get( {
			input   : config?.creationTemplate ? template.docsIndexWithCreate : template.docsIndex,
			output  : docsIndexFile,
			const   : { libPkg: this.#corePkg },
			partial : {
				installationGroup : { input: partial.installationGroup },
				creationGroup     : { input: partial.creationGroup },
			},
			hook : { before : async data => {

				const name         = this.projectName
				const layoutConfig = {
					layout : 'home',
					hero   : {
						name    : name.toUpperCase(),
						tagline : this.#wsPkg.extra.shortDesc,
						text    : this.#wsPkg.extra.action,
						image   : {
							src : '/logo.png',
							alt : name,
						},
						actions : config?.noAction
							? undefined
							: [
								{
									theme : 'brand',
									text  : 'Get started',
									link  : `/${docsRoute.guide}`,
								},
								{
									theme : 'alt',
									text  : 'View on GitHub',
									link  : this.#REPO_URL,
								},
							],
					},
					features : config?.noFeatures
						? undefined
						: [
							{
								title   : 'Get started',
								icon    : ICON.getStarted,
								details : 'Start your project now',
								link    : `/${docsRoute.guide}`,
							},
							{
								title   : 'Library / CLI',
								icon    : ICON.core,
								details : 'Check the documentation',
								link    : `/${docsRoute.guide}/${ID.core}`,
							},
							{
								title   : 'Plugins',
								icon    : ICON.plugin,
								details : 'Check our list of plugins',
								link    : `/${docsRoute.guide}/${ID.plugin}`,
							},
							{
								title   : 'Themes',
								icon    : ICON.theme,
								details : 'Check our list of themes',
								link    : `/${docsRoute.guide}/${ID.theme}`,
							},
						],
				}

				const customConfig = config?.custom || {}

				data.const.docsIndex = yaml.serialize( deepmerge( layoutConfig, customConfig ) )

				if ( config?.content ) data.const.docsIndex += `\n\n${config.content}`

				return data

			} },
		} )

	}

	async setContributorsFile( ) {

		console.info( this.getLogTitle( 'contributors file' ) )
		const data = await this.#getPublicPkgData()

		await this.#templates.get( {
			input  : template.docsContributors,
			output : joinPath( data.docsDir, FILE_NAME.CONTRIBUTORS ),
		} )

	}

	async setGuideSectionIndexFile( config: { none?: Type[] } = {} ) {

		console.info( this.getLogTitle( 'guide section index file' ) )

		const data     = await this.#getPublicPkgData( )
		const guideDir = data.docsGuideDir
		const info     = await this.getMarkdownInfo()

		for ( const v of Object.values( TYPE ) ) {

			if ( v === TYPE.lib ) continue
			if ( config.none?.includes( v ) ) continue

			await writeFile(
				joinPath( guideDir, v, FILE_NAME.INDEX ),
				info[v],
			)

		}

	}

	async setGuideIndexFile( ) {

		console.info( this.getLogTitle( 'guide index file' ) )

		const data        = await this.#getPublicPkgData( )
		const guideDir    = data.docsGuideDir
		const wsIndexFile = joinPath( this.#coreDir, 'docs', FILE_NAME.GUIDE )

		if ( await existsFile( wsIndexFile ) ) {

			await this.#templates.get( {
				input  : wsIndexFile,
				output : joinPath( guideDir, FILE_NAME.INDEX ),
				const  : { libPkg: this.#corePkg },
			} )

		}

	}

	async setPkgFiles() {

		const data       = await this.#getPublicPkgData( )
		const publicPkgs = data.data
		const info       = await this.getMarkdownInfo()

		for ( const publicPkg of publicPkgs ) {

			console.info( this.getLogTitle( publicPkg.name || '' ) )

			await ensureDir( publicPkg.docs.dir )

			//////////////////////////////////////////////////////////////////////////////
			// PACKAGE.JSON (OVERRIDE)

			const data = {
				...publicPkg.data,
				homepage   : joinUrl( this.#wsPkg.homepage || '', publicPkg.docs.urlPath.index ),
				repository : {
					type      : 'git',
					url       : this.#REPO_URL,
					directory : publicPkg.package.relativeDir,
				},
				license : this.#wsPkg.license,
				funding : this.#wsPkg.funding,
				bugs    : this.#wsPkg.bugs,
				...( this.#wsPkg.author ? { author: this.#wsPkg.author } : {} ),
			}

			await writeFile(
				publicPkg.package.packageJsonFile,
				JSON.stringify( data, undefined, '\t' ) + '\n',
			)

			//////////////////////////////////////////////////////////////////////////////
			// INDEX (DOCS)

			await this.#templates.get( {
				input   : publicPkg.package.docsFile  ? publicPkg.package.docsFile : `# ${publicPkg.name}\n\n${publicPkg.data.description}\n\n{{partial.installation}}\n`,
				output  : publicPkg.docs.indexFile,
				const   : { libPkg: publicPkg.data },
				partial : { installation: { input: partial.installationGroup } },
				hook    : { afterPartials : async data => {

					let finalcontent = `## More\n\n`

					if ( publicPkg.docs.examplesFile ) finalcontent += `- ${ICON.examples} [Examples](${FILE_NAME.EXAMPLES})\n`
					if ( publicPkg.docs.apiFile ) finalcontent += `- ${ICON.api} [API Docs](${FILE_NAME.API})\n`
					finalcontent += `- ${ICON.package} [NPM](https://www.npmjs.com/package/${publicPkg.data.name})\n`
					data.content += '\n' + finalcontent

					return data

				} },
			} )

			//////////////////////////////////////////////////////////////////////////////
			// EXAMPLES (DOCS)

			if ( publicPkg.docs.examplesFile && publicPkg.package.examplesConfigFile )
				await this.#examples.fromConfig( {
					input  : publicPkg.package.examplesConfigFile,
					output : publicPkg.docs.examplesFile,
					title  : `\`${publicPkg.name}\` - Examples`,
				} )

			//////////////////////////////////////////////////////////////////////////////
			// API (DOCS)

			if ( publicPkg.docs.apiFile && publicPkg.package.isTs )  {

				const ts2md = await this.#convert.ts2md( {
					input : [ publicPkg.package.srcFile ],
					opts  : {
						tsconfigPath    : publicPkg.package.tsconfigFile,
						packageJsonPath : publicPkg.package.packageJsonFile,
						typedoc         : { logLevel: 'Error' },
						typedocMarkdown : {
							hidePageHeader : true,
							hidePageTitle  : true,

						},
					},
				} )

				const apiContent = ts2md[0].content
					.replaceAll( '](index.md#', '](#' ) // this is because typedoc adds index.md# to the links

				await writeFile( publicPkg.docs.apiFile, `# \`${publicPkg.name}\` - API documentation\n\n` + apiContent )

			}

			//////////////////////////////////////////////////////////////////////////////
			// README (REPO)
			let content               = '',
				precontent            = ''
			const readmedocsPath      = joinPath( this.#coreDir, 'docs', FILE_NAME.README )
			const readmedocsLowerPath = joinPath( this.#coreDir, 'docs', FILE_NAME.README.toLowerCase() )

			if ( await existsFile( readmedocsPath ) )
				content += await readFile( readmedocsPath ) + '\n'
			else if ( await existsFile( readmedocsLowerPath ) )
				content += await readFile( readmedocsLowerPath ) + '\n'

			if ( publicPkg.id === ID.core ) {

				const wsDocsPath = joinPath( this.#coreDir, 'docs', FILE_NAME.WS )

				precontent += await existsFile( wsDocsPath ) ? ( await readFile( wsDocsPath ) + '\n' ) : ''

			}
			content += info.more

			const setReadmeFile = async ( i:string, o: string ) => await this.#templates.get( {
				input  : i,
				output : o,
				const  : {
					libPkg : publicPkg.data,
					info,
					title  : publicPkg.title,
					desc   : publicPkg.data.description,
				},
				partial : {
					footer       : { input: partial.footer },
					content      : { input: content },
					precontent   : { input: precontent },
					installation : { input: partial.installation },
				},
				hook : { afterPartials : async data => {

					// console.log( data )
					data.const.toc = await geMDTocString( {
						input           : data.content,
						title           : 'Table of contents',
						removeH1        : true,
						maxHeadingLevel : 4,
					} )

					return data

				} },
			} )

			await setReadmeFile( template.readmePkg, publicPkg.package.readmeFile )

			//////////////////////////////////////////////////////////////////////////////
			// WORKSPACE README
			//////////////////////////////////////////////////////////////////////////////
			if ( publicPkg.id === ID.core )
				await setReadmeFile( template.readmePkg, joinPath( this.wsDir, 'README.md' ) )

		}

	}

	async run() {

		//////////////////////////////////////////////////////////////////////////////
		// DOCS INDEX
		//////////////////////////////////////////////////////////////////////////////

		await this.setIndexFile()
		await this.setGuideIndexFile( )
		await this.setGuideSectionIndexFile( )
		await this.setContributorsFile( )

		//////////////////////////////////////////////////////////////////////////////
		// OWN PACAKGE
		//////////////////////////////////////////////////////////////////////////////
		await this.setPkgFiles()

	}

}

export const predocsCommand = defineConfig( { custom : { predocs : {
	desc : 'Create package docs simultaneously',
	fn   : async ( { config } ) => {

		const predocs = new Predocs( undefined, config )
		await predocs.run()

	},
} } } )
