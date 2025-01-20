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
	existsPath,
} from '@dovenv/core/utils'
import {
	templates,
	examples,
	convert,
	repo,
} from '@dovenv/theme-banda'

import {
	docsRoute,
	FILE_NAME,
	ID,
	TYPE,
} from './const'
import { partialConstructor }  from './data/partials'
import { templateConstructor } from './data/templates'
import {
	getEmoji,
	getEmojiList,
} from './emoji'
import {
	getPublicPackageByType,
	getPublicPackageData,
} from './pkg'

import type {
	PkgData,
	PkgType,
	PredocsConfig,
} from './types'
import type { Config } from '@dovenv/core'
import type {
	ObjectValues,
	PackageJSON,
} from '@dovenv/core/utils'

// TODO: Add contributors to readmes

type MdInfoKey = keyof ReturnType<typeof getPublicPackageByType>
type MarkdownInfo = { more: string } & { [key in MdInfoKey]? : string }

type Emoji = ObjectValues<NonNullable<ReturnType<typeof getEmojiList>>> | string

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
	#mdInfo   : undefined | MarkdownInfo

	projectName
	title = 'predocs'

	#EMOJI
	template
	partial

	protected getLogTitle

	constructor( opts?: PredocsConfig, config?: Config ) {

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
		this.#REPO_URL  = typeof config?.const?.REPO_URL === 'string' ? config.const.REPO_URL : ''

		this.projectName = this.#wsPkg.extra.productName || this.#wsPkg.extra.id || this.#wsPkg.name
		this.getLogTitle = ( t: string ) => `${color.inverse( ` ${t} ` )}\n`
		this.#EMOJI      = getEmojiList( this.opts?.emoji )

		this.template = templateConstructor( this.#EMOJI )
		this.partial  = partialConstructor( this.#EMOJI )

		console.debug( {
			...opts,
			emojis : this.#EMOJI,
		} )

	}

	async #getPkgPaths(): Promise<string[]> {

		if ( this.#pkgPaths ) return this.#pkgPaths

		return await this.getPkgPaths()

	}

	async #getPublicPkgData(): Promise<PkgData> {

		if ( this.#pkgData ) return this.#pkgData

		const pkgPaths = await this.#getPkgPaths()
		const data     = await getPublicPackageData( pkgPaths, this.wsDir, this.#wsPkg, this.#EMOJI )
		console.debug( data )
		return data

	}

	#setMdTitle( v:string, i?: string | Emoji, h?: number ) {

		if ( !h ) h = 2
		return '#'.repeat( h ) + ( i ? ` ${i} ${v}\n\n` :  ` ${v}\n\n` )

	}

	#getEmoji( v:string ) {

		if ( !this.#EMOJI ) return undefined
		return getEmoji( this.#EMOJI, v )

	}

	#setMdLink( name:string, url:string, i?: string | Emoji ) {

		return i ? `- ${i} [${name}](${url})` : `- [${name}](${url})`

	}

	async getMarkdownInfo(): Promise<MarkdownInfo> {

		if ( this.#mdInfo ) return this.#mdInfo

		const data             = await this.#getPublicPkgData()
		const publicPkgGrouped = getPublicPackageByType( data.data )

		const res: MarkdownInfo = { more: this.#setMdTitle( 'More', this.#EMOJI?.more ) }

		for ( const [ type, items ] of Object.entries( publicPkgGrouped ) ) {

			if ( !Array.isArray( items ) || !items.length ) continue

			if ( type === TYPE.lib ) {

				res[type] = this.#setMdTitle( 'Other tools', this.#EMOJI?.['toolkit'] )
				for ( const item of items ) {

					res.more += this.#setMdLink(
						capitalize( item.id ),
						joinUrl( data.url, data.urlGuidePath, item.id ),
						this.#getEmoji( item.id ),
					) + '\n'

				}

			}
			else {

				const titleSection = type + ( type === TYPE.plugin ? 's' : '' )
				res.more          += this.#setMdLink(
					capitalize( titleSection ),
					joinUrl( data.url, data.urlGuidePath, type ),
					this.#getEmoji( type ),
				) + '\n'

				if ( type in publicPkgGrouped )
					res[type as keyof MarkdownInfo] = this.#setMdTitle( capitalize( titleSection ), this.#EMOJI?.[type], 1 )

				for ( const item of items ) {

					const emoj     = this.#getEmoji( item.id )
					const titleRaw = capitalize( item.id )
					const title    = this.#setMdTitle( titleRaw, emoj )

					res[type as keyof typeof res] += `${title}${item.data.description}\n\n- [Read more](${item.docs.urlPath.index})\n\n`
					res.more                      += `  ${this.#setMdLink( titleRaw, joinUrl( data.url, item.docs.urlPath.index ), emoj )}\n`

				}

			}

		}

		this.#mdInfo = res
		return res

	}

	async setIndexFile( config?: PredocsConfig['index'] ) {

		console.info( this.getLogTitle( 'index file' ) )

		config              = deepmerge( this.opts?.index || {}, config || {} )
		const data          = await this.#getPublicPkgData()
		const docsIndexFile = joinPath( data.docsDir, FILE_NAME.INDEX )
		const groupedData   = getPublicPackageByType( data['data'] )
		const groups        = Object.keys( groupedData )

		await this.#templates.get( {
			input   : config?.creationTemplate ? this.template.docsIndexWithCreate : this.template.docsIndex,
			output  : docsIndexFile,
			const   : { libPkg: this.#corePkg },
			partial : {
				installationGroup : { input: this.partial.installationGroup },
				creationGroup     : { input: this.partial.creationGroup },
			},
			hook : { before : async d => {

				const existsLogo   = await existsPath( joinPath( data.docsPublicDir, 'logo.png' ) )
				const name         = this.projectName
				const layoutConfig = {
					layout : 'home',
					hero   : {
						name    : name.toUpperCase(),
						tagline : this.#wsPkg.extra.shortDesc,
						text    : this.#wsPkg.extra.action,
						image   : existsLogo
							? {
								src : '/logo.png',
								alt : name,
							}
							: undefined,
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
								icon    : this.#EMOJI?.getStarted,
								details : 'Start your project now',
								link    : `/${docsRoute.guide}`,
							},
							{
								title   : 'Library / CLI',
								icon    : this.#EMOJI?.library,
								details : 'Check the documentation',
								link    : `/${docsRoute.guide}/${ID.core}`,
							},
							groups.includes( ID.plugin )
								? {
									title   : 'Plugins',
									icon    : this.#EMOJI?.plugin,
									details : 'Check our list of plugins',
									link    : `/${docsRoute.guide}/${ID.plugin}`,
								}
								: undefined,
							groups.includes( ID.theme )
								? {
									title   : 'Themes',
									icon    : this.#EMOJI?.theme,
									details : 'Check our list of themes',
									link    : `/${docsRoute.guide}/${ID.theme}`,
								}
								: undefined,
							groups.includes( ID.preset )
								? {
									title   : 'Presets',
									icon    : this.#EMOJI?.preset,
									details : 'Check our list of presets',
									link    : `/${docsRoute.guide}/${ID.preset}`,
								}
								: undefined,
						].filter( d => d !== undefined ),
				}

				const customConfig = config?.custom || {}

				d.const.docsIndex = yaml.serialize( deepmerge( layoutConfig, customConfig ) )

				if ( config?.content ) d.const.docsIndex += `\n\n${config.content}`

				return d

			} },
		} )

	}

	async setContributorsFile( ) {

		console.info( this.getLogTitle( 'contributors file' ) )
		const data = await this.#getPublicPkgData()

		await this.#templates.get( {
			input  : this.template.docsContributors,
			output : joinPath( data.docsDir, FILE_NAME.CONTRIBUTORS ),
		} )

	}

	async setGuideSectionIndexFile( config: PredocsConfig['guideSection'] = {} ) {

		console.info( this.getLogTitle( 'guide section index file' ) )

		config         = deepmerge( this.opts?.guideSection || {}, config || {} )
		const data     = await this.#getPublicPkgData( )
		const guideDir = data.docsGuideDir
		const info     = await this.getMarkdownInfo()

		for ( const key of Object.keys( info ) ) {

			const v = key as PkgType
			if ( v === TYPE.lib ) continue
			if ( !Object.values( TYPE ).includes( v ) || config.none?.includes( v ) ) continue

			const content = v in info ? info[v] : undefined
			if ( !content ) continue
			const dir = joinPath( guideDir, v )

			await ensureDir( dir )
			await writeFile(
				joinPath( dir, FILE_NAME.INDEX ),
				content,
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

	// eslint-disable-next-line no-unused-private-class-members
	async #getContributorsHTML( pkg?: PackageJSON ) {

		try {

			const ctr     = repo.package2Contributors( pkg || {} )
			const ctrInst = new repo.Contributors( ctr )
			return await ctrInst.getHtmlContent()

		}
		catch ( _ ) {

			console.warn( 'Fail getting contributors' )
			return

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
				partial : { installation: { input: this.partial.installationGroup } },
				hook    : { afterPartials : async data => {

					let finalcontent = this.#setMdTitle( `More`, this.#EMOJI?.more )

					if ( publicPkg.docs.examplesFile ) finalcontent += this.#setMdLink( 'Examples', FILE_NAME.EXAMPLES, this.#EMOJI?.examples ) + '\n'
					if ( publicPkg.docs.apiFile ) finalcontent += this.#setMdLink( 'API Docs', FILE_NAME.API, this.#EMOJI?.api ) + '\n'
					finalcontent += this.#setMdLink( 'NPM', `https://www.npmjs.com/package/${publicPkg.data.name}`, this.#EMOJI?.package ) + '\n'
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

			const localBanner = this.pkg?.extra?.bannerURL ? this.pkg?.extra?.bannerURL as string : await existsFile( joinPath( this.wsDir, 'docs/public/banner.png' ) )

			const banner = localBanner && typeof localBanner == 'string'
				? localBanner
				: localBanner
					? `[![BANNER]({{const.pkg.repository.url}}/blob/main/docs/public/banner.png?raw=true)]({{const.pkg.homepage}})`
					: ''

			const contributorHtml = undefined//await this.#getContributorsHTML()

			const setReadmeFile = async ( i:string, o: string ) => await this.#templates.get( {
				input  : i,
				output : o,
				const  : {
					libPkg       : publicPkg.data,
					info,
					title        : publicPkg.title,
					desc         : publicPkg.data.description,
					banner       : banner,
					contributors : contributorHtml ? `## Contributors\n\n${contributorHtml}` : '',
				},
				partial : {
					footer       : { input: this.partial.footer },
					content      : { input: content },
					precontent   : { input: precontent },
					installation : { input: this.partial.installation },
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

			await setReadmeFile( this.template.readmePkg, publicPkg.package.readmeFile )

			//////////////////////////////////////////////////////////////////////////////
			// WORKSPACE README
			//////////////////////////////////////////////////////////////////////////////
			if ( publicPkg.id === ID.core )
				await setReadmeFile( this.template.readmePkg, joinPath( this.wsDir, FILE_NAME.README ) )

		}

	}

	async #run() {

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

	async run() {

		await this.catchFn( this.#run() )

	}

}

export const predocsPlugin = ( opts?: PredocsConfig ) => defineConfig( { custom : { predocs : {
	desc : 'Create package docs simultaneously',
	fn   : async ( { config } ) => {

		const predocs = new Predocs( opts, config )
		await predocs.run()

	},
} } } )
