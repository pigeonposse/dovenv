import { defineConfig } from '@dovenv/core'
import {
	yaml,
	joinPath,
	writeFile,
	ensureDir,
	joinUrl,
	existsFile,
	geMDTocString,
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
import type { CommandUtils } from '@dovenv/core'
import type {
	ObjectValues,
	PackageJSON,
} from '@dovenv/core/utils'

// TODO: Add contributors to readmes

type MdInfoKey = keyof ReturnType<typeof getPublicPackageByType>
type MarkdownInfo = { more: string } & { [key in MdInfoKey]? : string }
type SkipOpts = {
	pkg?      : boolean
	index?    : boolean
	readme?   : boolean
	api?      : boolean
	examples? : boolean
}
type Emoji = ObjectValues<NonNullable<ReturnType<typeof getEmojiList>>> | string

export class Predocs {

	#examples
	#templates
	#convert
	#wsPkg
	#corePkg
	#coreDir
	#REPO_URL
	#mdInfo : undefined | MarkdownInfo

	projectName
	title = 'predocs'

	#EMOJI
	template
	partial
	opts            : PredocsConfig | undefined
	protected utils : CommandUtils

	constructor( {
		opts, utils,
	}:{
		opts? : PredocsConfig
		utils : CommandUtils
	} ) {

		this.opts  = opts
		this.utils = utils

		const { Examples }  = examples
		const { Templates } = templates
		const { Convert }   = convert
		const { config }    = this.utils

		this.#examples  = new Examples( { utils } )
		this.#templates = new Templates( { utils } )
		this.#convert   = new Convert( )

		this.#wsPkg    = ( this.utils.pkg || {} ) as PackageJSON
		this.#corePkg  = ( config?.const?.corePkg || config?.const?.pkg ) as PackageJSON
		this.#coreDir  = config?.const?.coreDir as string || joinPath( this.utils.wsDir, 'packages', 'core' )
		this.#REPO_URL = typeof config?.const?.REPO_URL === 'string' ? config.const.REPO_URL : ''

		this.projectName = this.#wsPkg.extra.productName || this.#wsPkg.extra.id || this.#wsPkg.name
		this.#EMOJI      = getEmojiList( this.opts?.emoji )

		this.template = templateConstructor( this.#EMOJI )
		this.partial  = partialConstructor( this.#EMOJI )

		console.debug( {
			...opts,
			emojis : this.#EMOJI,
		} )

	}

	async #getPublicPkgData(): Promise<PkgData> {

		const pkgPaths = await this.utils.getPkgPaths()

		const data = await getPublicPackageData( pkgPaths, this.utils.wsDir, this.#wsPkg, this.#EMOJI )
		console.debug( data )
		return data

	}

	#setMdTitle( v:string, i?: string | Emoji, h?: number ) {

		if ( !h ) h = 2
		return '#'.repeat( h ) + ( i ? ` ${i} ${v}\n\n` : ` ${v}\n\n` )

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

		const tasks = Object.entries( publicPkgGrouped ).map( async ( [ type, items ] ) => {

			if ( !Array.isArray( items ) || !items.length ) return

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

		} )

		await Promise.all( tasks )

		this.#mdInfo = res
		return res

	}

	async setIndexFile( config?: PredocsConfig['index'] ) {

		config              = deepmerge( this.opts?.index || {}, config || {} )
		const data          = await this.#getPublicPkgData()
		const docsIndexFile = joinPath( data.docsDir, FILE_NAME.INDEX )
		const groupedData   = getPublicPackageByType( data['data'] )
		const groups        = Object.keys( groupedData )

		await this.#templates.get( {
			title   : 'index file',
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

		const data = await this.#getPublicPkgData()

		await this.#templates.get( {
			title  : 'contributors file',
			input  : this.template.docsContributors,
			output : joinPath( data.docsDir, FILE_NAME.CONTRIBUTORS ),
		} )

	}

	async setGuideSectionIndexFile( config: PredocsConfig['guideSection'] = {} ) {

		config         = deepmerge( this.opts?.guideSection || {}, config || {} )
		const data     = await this.#getPublicPkgData( )
		const info     = await this.getMarkdownInfo()
		const guideDir = data.docsGuideDir
		const tasks    = Object.keys( info ).map( async key => {

			const v = key as PkgType
			if ( v === TYPE.lib ) return
			if ( !Object.values( TYPE ).includes( v ) || config.none?.includes( v ) ) return

			const content = v in info ? info[v] : undefined
			if ( !content ) return
			const dir = joinPath( guideDir, v )

			await ensureDir( dir )
			const path = joinPath( dir, FILE_NAME.INDEX )
			await writeFile(
				path,
				content,
			)
			this.utils.prompt.log.success( this.utils.style.info.badge( 'guide section index file' ) + ' ' + this.utils.style.info.msg( 'Overwrite content to', path ) )

		} )

		await Promise.all( tasks )

	}

	async setGuideIndexFile( ) {

		const data        = await this.#getPublicPkgData( )
		const guideDir    = data.docsGuideDir
		const wsIndexFile = joinPath( this.#coreDir, 'docs', FILE_NAME.GUIDE )
		const title       = 'guide index file'
		if ( await existsFile( wsIndexFile ) ) await this.#templates.get( {
			title,
			input  : wsIndexFile,
			output : joinPath( guideDir, FILE_NAME.INDEX ),
			const  : { libPkg: this.#corePkg },
		} )
		else this.utils.prompt.log.info( this.utils.style.info.badge( title ) + ' Guide index file does not exist in: ' + wsIndexFile )

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

	async #setPkgFile( {
		publicPkg, info, skip,
	}:{
		publicPkg : PkgData['data'][number]
		info      : MarkdownInfo
		skip?     : SkipOpts
	} ) {

		await ensureDir( publicPkg.docs.dir )

		//////////////////////////////////////////////////////////////////////////////
		// PACKAGE.JSON (OVERRIDE)
		if ( !skip?.pkg ) {

			const data = {
				...publicPkg.data,
				homepage   : joinUrl( publicPkg.data.homepage || '', publicPkg.docs.urlPath.index ),
				repository : {
					type      : this.#REPO_URL.startsWith( 'git+' ) ? 'git' : 'https',
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

		}

		//////////////////////////////////////////////////////////////////////////////
		// INDEX (DOCS)
		if ( !skip?.index ) {

			try {

				await this.#templates.get( {
					title   : publicPkg.name || '',
					input   : publicPkg.package.docsFile ? publicPkg.package.docsFile : `# ${publicPkg.name}\n\n${publicPkg.data.description}\n\n{{partial.installation}}\n`,
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

			}
			catch ( e ) {

				throw new Error( `Failed to generate index.\n Error: ${e instanceof Error ? e.message : e?.toString()}` )

			}

		}

		//////////////////////////////////////////////////////////////////////////////
		// EXAMPLES (DOCS)
		if ( !skip?.examples ) {

			try {

				if ( publicPkg.docs.examplesFile && publicPkg.package.examplesConfigFile )
					await this.#examples.fromConfig( {
						input  : publicPkg.package.examplesConfigFile,
						output : publicPkg.docs.examplesFile,
						title  : `\`${publicPkg.name}\` - Examples`,
					} )

			}
			catch ( e ) {

				throw new Error( `Failed to generate examples.\n Error: ${e instanceof Error ? e.message : e?.toString()}` )

			}

		}
		//////////////////////////////////////////////////////////////////////////////
		// API (DOCS)
		if ( !skip?.api ) {

			try {

				if ( publicPkg.docs.apiFile && publicPkg.package.isTs ) {

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

			}
			catch ( e ) {

				throw new Error( `Failed to generate api.\n Error: ${e instanceof Error ? e.message : e?.toString()}` )

			}

		}

		if ( !skip?.readme ) {

			try {

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

				const localPkgBanner  = this.utils.pkg?.extra?.bannerURL && typeof this.utils.pkg?.extra?.bannerURL === 'string' ? this.utils.pkg?.extra?.bannerURL as string : undefined
				const localBanner     = joinPath( this.utils.wsDir, 'docs/public/banner.png' )
				const remoteBannerURL = joinUrl( this.#REPO_URL, 'blob/main/docs/public/banner.png?raw=true' )
				const bannerUrl       = localPkgBanner ? localPkgBanner : ( await existsFile( localBanner ) ? remoteBannerURL : undefined )

				const banner = bannerUrl
					? `[![BANNER](${bannerUrl})](${this.#corePkg.homepage})`
					: ''

				const contributorHtml = undefined //await this.#getContributorsHTML()

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
					await setReadmeFile( this.template.readmePkg, joinPath( this.utils.wsDir, FILE_NAME.README ) )

			}
			catch ( e ) {

				throw new Error( `Failed to generate readme.\n Error: ${e instanceof Error ? e.message : e?.toString()}` )

			}

		}

	}

	/**
	 *
	 * Set the files for each package in the workspace.
	 *
	 * @param   {object}        [opts]      - Options.
	 * @param   {SkipOpts}      [opts.skip] - Skip options.
	 * @returns {Promise<void>}
	 */
	async setPkgFiles( opts?: { skip?: SkipOpts } ) {

		const publicPkgs = ( await this.#getPublicPkgData( ) ).data
		const info       = await this.getMarkdownInfo()
		const tasks      = publicPkgs.map( async publicPkg => {

			try {

				await this.#setPkgFile( {
					publicPkg,
					info,
					skip : opts?.skip,
				} )

			}
			catch ( e ) {

				throw new Error( `Failed in package ${publicPkg.name}.\n Error: ${e instanceof Error ? e.message : e?.toString()}\n` )

			}

		} )
		await Promise.all( tasks )

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

		await this.utils.catchFn( this.#run() )

	}

}

/**
 * Create package docs simultaneously.
 *
 * @param   {PredocsConfig}                       [opts] - Optional opts to pass to {@link Predocs}.
 * @returns {import('@dovenv/core').DovenvConfig}        - Dovenv plugin config.
 */
export const predocsPlugin = ( opts?: PredocsConfig ) => defineConfig( { custom : { predocs : {
	desc : 'Create package docs simultaneously',
	fn   : async ( { utils } ) => {

		// console.dir( {
		// 	opts,
		// 	utils,
		// } )
		const predocs = new Predocs( {
			opts,
			utils,
		} )
		await predocs.run()

	},
} } } )
