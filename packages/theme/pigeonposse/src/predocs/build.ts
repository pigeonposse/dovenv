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
	kebab2Camel,
	createMdLinks,
	createBadgeURL,
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

type MdInfoKey = keyof ReturnType<typeof getPublicPackageByType>
type MarkdownInfo = { more: string } & { [key in MdInfoKey]? : string }
type Templates = InstanceType<typeof templates['Templates']>
type Convert = InstanceType<typeof convert['Convert']>
type Examples = InstanceType<typeof examples['Examples']>

type GuideIndexFileOpts = { props?: Templates['opts'] }
type GuideSectionIndexFileOpts = PredocsConfig['guideSection']
type IndexFileOpts = PredocsConfig['index']
type ContributorsFileOpts = { props?: Templates['opts'] }

type PackageFileOpts = {
	packages? : false | { props?: PackageJSON }
	index?    : false | { props?: Templates['opts'] }
	readme?   : false | {
		props?         : Templates['opts']
		/**
		 * Constructs Markdown links or images from an array of links.
		 */
		markdownLinks? : ( pkg: PkgData['data'][number] ) => NonNullable<Parameters<typeof createMdLinks>[0]>
	}
	api?      : false | { props?: Parameters<Convert['ts2md']>['0'] }
	examples? : false | { props?: Examples['opts'] }
}

type PackageFileConfig = {
	wsData    : PkgData
	publicPkg : PkgData['data'][number]
	info      : MarkdownInfo
}
type RunOpts = {
	packages?          : false | PackageFileOpts
	guideIndex?        : false | GuideIndexFileOpts
	guideSectionIndex? : false | GuideSectionIndexFileOpts
	index?             : false | IndexFileOpts
	contributors?      : false | ContributorsFileOpts
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

	#mdInfo            : MarkdownInfo | undefined
	#publicPackageData : PkgData | undefined

	protected utils : CommandUtils

	/**
	 * The name of the project
	 */
	title = 'predocs'

	/**
	 * General Configuration options
	 */
	opts : PredocsConfig | undefined

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

		console.debug( {
			...opts,
			emojis : this.#EMOJI,
		} )

	}

	#projectName : string | undefined
	get projectName() {

		if ( this.#projectName ) return this.#projectName
		const res = this.#wsPkg?.extra?.productName as string || this.#wsPkg?.extra?.id as string || this.#wsPkg.name
		if ( !res ) throw new Error( 'Name not found in workspace package. Please add "name", "extra.productName" or "extra.id" to your workspace package.json' )
		this.#projectName = res
		return res

	}

	/**
	 * Object containing templates
	 *
	 * @returns {object} - Object containing templates strings
	 */
	get template() {

		return templateConstructor( this.#EMOJI )

	}

	/**
	 * Object containing partials
	 *
	 * @returns {object} - Object containing partials strings
	 */
	get partial() {

		return partialConstructor( this.#EMOJI )

	}

	get #EMOJI() {

		return getEmojiList( this.opts?.emoji )

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

	async #getPublicPkgData(): Promise<PkgData> {

		if ( this.#publicPackageData ) return this.#publicPackageData

		const pkgPaths = await this.utils.getPkgPaths()
		const data     = await getPublicPackageData( pkgPaths, this.utils.wsDir, this.#wsPkg, this.#EMOJI )
		console.debug( data )
		return data

	}

	/**
	 * Returns the public packages data for the workspace.
	 *
	 * @returns {Promise<PkgData>} An array of public package data objects.
	 */
	async getWorkspacePublicPackagesData(): Promise<PkgData> {

		try {

			return await this.#getPublicPkgData( )

		}
		catch ( e ) {

			throw new Error( 'Failed to get workspace public packages data.\n - ' + ( e instanceof Error ? e.message : e?.toString() ) )

		}

	}

	/**
	 * Retrieves and constructs the Markdown information for the packages.
	 *
	 * - If the Markdown information is already available, it returns the cached result.
	 * - Otherwise, it fetches the public package data and groups them by type.
	 * - For each group, it constructs a structured Markdown content that includes
	 * titles, descriptions, and links for each package.
	 *
	 * @returns {Promise<MarkdownInfo>} A promise that resolves to an object containing
	 *                                  the Markdown content for each package type.
	 */
	async getMarkdownInfo(): Promise<MarkdownInfo> {

		try {

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
		catch ( e ) {

			throw new Error( 'Failed to get Markdown information\n - ' + ( e instanceof Error ? e.message : e?.toString() ) )

		}

	}

	/**
	 * Writes the index file to the documentation root directory.
	 *
	 * This file is the entry point for users to access the documentation.
	 * It is a generated file that is rewritten every time the documentation is built.
	 *
	 * @param   {IndexFileOpts} [opts] - The options object.
	 * @returns {Promise<void>}        An empty fulfilled promise.
	 */
	async setIndexFile( opts?: IndexFileOpts ) {

		try {

			opts                = deepmerge( this.opts?.index || {}, opts || {} )
			const data          = await this.#getPublicPkgData()
			const docsIndexFile = joinPath( data.docsDir, FILE_NAME.INDEX )
			const groupedData   = getPublicPackageByType( data['data'] )
			const groups        = Object.keys( groupedData )
			const partials      = this.partial
			const templates     = this.template

			await this.#templates.get( {
				title   : 'index file',
				input   : opts?.creationTemplate ? templates.docsIndexWithCreate : templates.docsIndex,
				output  : docsIndexFile,
				const   : { libPkg: this.#corePkg },
				partial : {
					installationGroup : { input: partials.installationGroup },
					creationGroup     : { input: partials.creationGroup },
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
							actions : opts?.noAction
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
						features : opts?.noFeatures
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

					const customConfig = opts?.custom || {}

					d.const.docsIndex = await yaml.serialize( deepmerge( layoutConfig, customConfig ) )

					if ( opts?.content ) d.const.docsIndex += `\n\n${opts.content}`

					return d

				} },
			} )

		}
		catch ( e ) {

			throw new Error( 'Failed to write index file.\n - ' + ( e instanceof Error ? e.message : e?.toString() ) )

		}

	}

	/**
	 * Generates and writes a contributors file using the specified template.
	 *
	 * @param {ContributorsFileOpts} [opts] - Optional configuration for generating the contributors file.
	 *                                      Can include additional properties to pass to the template.
	 */
	async setContributorsFile( opts?: ContributorsFileOpts ) {

		try {

			const data      = await this.#getPublicPkgData()
			const templates = this.template

			await this.#templates.get( {
				title  : 'contributors file',
				input  : templates.docsContributors,
				output : joinPath( data.docsDir, FILE_NAME.CONTRIBUTORS ),
				...( opts?.props || {} ),
			} )

		}
		catch ( e ) {

			throw new Error( 'Failed to write contributors file.\n - ' + ( e instanceof Error ? e.message : e?.toString() ) )

		}

	}

	/**
	 * Writes the guide section index files.
	 *
	 * @param   {GuideSectionIndexFileOpts} [opts] - The options object.
	 * @returns {Promise<void>}                    An empty fulfilled promise.
	 */
	async setGuideSectionIndexFile( opts?: GuideSectionIndexFileOpts ) {

		try {

			opts           = deepmerge( this.opts?.guideSection || {}, opts || {} )
			const data     = await this.#getPublicPkgData( )
			const info     = await this.getMarkdownInfo()
			const guideDir = data.docsGuideDir
			const tasks    = Object.keys( info ).map( async key => {

				const v = key as PkgType
				if ( v === TYPE.lib ) return
				if ( !Object.values( TYPE ).includes( v ) || opts?.none?.includes( v ) ) return

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
		catch ( e ) {

			throw new Error( 'Failed to write guide section index file.\n - ' + ( e instanceof Error ? e.message : e?.toString() ) )

		}

	}

	/**
	 * Sets the guide index file in the documentation directory.
	 *
	 * This method checks if a workspace index file exists within the core directory.
	 * If it exists, it uses the templates to generate the guide index file and writes
	 * it to the documentation guide directory. If the file does not exist, an info
	 * message is logged.
	 *
	 * @param {GuideIndexFileOpts} [opts] - Optional configuration for template properties.
	 */

	async setGuideIndexFile( opts?: GuideIndexFileOpts ) {

		try {

			const data        = await this.#getPublicPkgData( )
			const guideDir    = data.docsGuideDir
			const wsIndexFile = joinPath( this.#coreDir, 'docs', FILE_NAME.GUIDE )
			const title       = 'guide index file'
			if ( await existsFile( wsIndexFile ) ) await this.#templates.get( {
				title,
				input  : wsIndexFile,
				output : joinPath( guideDir, FILE_NAME.INDEX ),
				const  : { libPkg: this.#corePkg },
				...( opts?.props || {} ),
			} )
			else this.utils.prompt.log.info( this.utils.style.info.badge( title ) + ' Guide index file does not exist in: ' + wsIndexFile )

		}
		catch ( e ) {

			throw new Error( 'Failed to write guide index file.\n - ' + ( e instanceof Error ? e.message : e?.toString() ) )

		}

	}

	async #getContributorsMarkdown( pkg?: PackageJSON ) {

		try {

			const ctr = repo.package2Contributors( pkg || {} )

			const ctrInst = new repo.Contributors( {
				opts : deepmerge( ctr, {
					role   : repo.CONTRIBUTOR_ROLE,
					member : this.utils?.pkg?.extra?.collective?.id && this.utils?.pkg?.extra?.collective?.name && this.utils?.pkg?.extra?.collective?.gh
						? [
							{
								role       : 'organization' as const,
								ghUsername : this.utils?.pkg?.extra?.collective?.id,
								name       : this.utils?.pkg?.extra?.collective?.name,
								url        : this.utils?.pkg?.extra?.collective?.gh,
							},
						]
						: undefined,
				} ),
				utils : this.utils,
			} )
			return await ctrInst.getMarkdownContent()

		}
		catch ( _ ) {

			console.warn( 'Fail getting contributors markdown' )
			return

		}

	}

	/**
	 * Writes the package.json file for the documentation package.
	 *
	 * This method sets the `homepage`, `repository`, `license`, `funding`, and `bugs` fields
	 * in the package.json file. It also copies the `author` field from the workspace package.json
	 * if it exists. If the {@link PackageFileOpts.packages} option is set to `false`, the method does nothing.
	 *
	 * @param {PackageFileConfig}           config - Configuration for the package file.
	 * @param {PackageFileOpts['packages']} [opts] - Optional configuration for the package file.
	 */
	async setPackageJSONFile( config: PackageFileConfig, opts?: PackageFileOpts['packages'] ) {

		try {

			if ( opts === false ) return
			const { publicPkg } = config

			const data = {
				...publicPkg.data,
				homepage   : joinUrl( config.wsData.url || '', publicPkg.docs.urlPath.index ),
				repository : {
					type      : this.#REPO_URL.startsWith( 'git+' ) ? 'git' : 'https',
					url       : this.#REPO_URL,
					directory : publicPkg.package.relativeDir,
				},
				license : this.#wsPkg.license,
				funding : this.#wsPkg.funding,
				bugs    : this.#wsPkg.bugs,
				...( this.#wsPkg.author ? { author: this.#wsPkg.author } : {} ),
				...( opts?.props || {} ),
			}

			await writeFile(
				publicPkg.package.packageJsonFile,
				JSON.stringify( data, undefined, '\t' ) + '\n',
			)

		}
		catch ( e ) {

			throw new Error( `Failed to generate package.json.\n - ${e instanceof Error ? e.message : e?.toString()}` )

		}

	}

	/**
	 * Sets the index file for the package in the documentation directory.
	 *
	 * @param {PackageFileConfig}        config - Configuration for the package file.
	 * @param {PackageFileOpts['index']} [opts] - Optional configuration for the package file.
	 * @example
	 * const predocs = new Predocs()
	 * const publicPkgs = await predocs.getWorkspacePublicPackageData( )
	 * const info = await predocs.getMarkdownInfo()
	 *
	 * for ( const publicPkg of publicPkgs ) {
	 *   await predocs.setPackageIndexFile( { publicPkg, info } )
	 * }
	 */
	async setPackageIndexFile( config:PackageFileConfig, opts?: PackageFileOpts['index'] ) {

		try {

			if ( opts === false ) return

			const { publicPkg } = config
			const partials      = this.partial
			await this.#templates.get( {
				title   : publicPkg.name || '',
				input   : publicPkg.package.docsFile ? publicPkg.package.docsFile : `# ${publicPkg.name}\n\n${publicPkg.data.description}\n\n{{partial.installation}}\n`,
				output  : publicPkg.docs.indexFile,
				const   : { libPkg: publicPkg.data },
				partial : { installation: { input: partials.installationGroup } },
				hook    : { afterPartials : async data => {

					let finalcontent = this.#setMdTitle( `More`, this.#EMOJI?.more )

					if ( publicPkg.docs.examplesFile ) finalcontent += this.#setMdLink( 'Examples', FILE_NAME.EXAMPLES, this.#EMOJI?.examples ) + '\n'
					if ( publicPkg.docs.apiFile ) finalcontent += this.#setMdLink( 'API Docs', FILE_NAME.API, this.#EMOJI?.api ) + '\n'
					finalcontent += this.#setMdLink( 'NPM', `https://www.npmjs.com/package/${publicPkg.data.name}`, this.#EMOJI?.package ) + '\n'
					data.content += '\n' + finalcontent

					return data

				} },
				...( opts?.props || {} ),
			} )

		}
		catch ( e ) {

			throw new Error( `Failed to generate index.\n - ${e instanceof Error ? e.message : e?.toString()}` )

		}

	}

	/**
	 * Generates a file with examples.
	 *
	 * @param   {object}        config - The public package configuration.
	 * @param   {object}        [opts] - The options to pass to the examples plugin.
	 * @returns {Promise<void>}
	 * @example
	 * const predocs = new Predocs()
	 * const publicPkgs = await predocs.getWorkspacePublicPackageData( )
	 * const info = await predocs.getMarkdownInfo()
	 * for ( const publicPkg of publicPkgs ) {
	 *   await predocs.setPackageExamplesFile( { publicPkg, info } )
	 * }
	 */
	async setPackageExamplesFile( config:PackageFileConfig, opts?: PackageFileOpts['examples'] ) {

		try {

			if ( opts === false ) return

			const { publicPkg } = config
			if ( publicPkg.docs.examplesFile && publicPkg.package.examplesConfigFile )
				await this.#examples.fromConfig( {
					input  : publicPkg.package.examplesConfigFile,
					output : publicPkg.docs.examplesFile,
					title  : `\`${publicPkg.name}\` - Examples`,
					...( opts?.props || {} ),
				} )

		}
		catch ( e ) {

			throw new Error( `Failed to generate examples.\n - ${e instanceof Error ? e.message : e?.toString()}` )

		}

	}

	/**
	 * Generates and writes the API documentation file for a package.
	 *
	 * @param {PackageFileConfig}      config - Configuration object containing public package data and markdown info.
	 * @param {PackageFileOpts['api']} [opts] - Optional configuration properties for the API file generation.
	 *                                        If set to `false`, the function exits without processing.
	 * @throws {Error} Throws an error if the API documentation generation fails.
	 */
	async setPackageApiFile( config:PackageFileConfig, opts?: PackageFileOpts['api'] ) {

		try {

			if ( opts === false ) return

			const { publicPkg } = config
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
					...( opts?.props || {} ),
				} )

				const apiContent = ts2md[0].content
					.replaceAll( '](index.md#', '](#' ) // this is because typedoc adds index.md# to the links

				await writeFile( publicPkg.docs.apiFile, `# \`${publicPkg.name}\` - API documentation\n\n` + apiContent )

			}

		}
		catch ( e ) {

			throw new Error( `Failed to generate api.\n - ${e instanceof Error ? e.message : e?.toString()}` )

		}

	}

	/**
	 * Generates and writes the README file for a package.
	 *
	 * @param {PackageFileConfig}         config - Configuration object containing public package data and markdown info.
	 * @param {PackageFileOpts['readme']} [opts] - Optional configuration properties for the README generation.
	 *                                           If set to `false`, the function exits without processing.
	 * @throws {Error} Throws an error if the README generation fails.
	 */
	async setPackageReadmeFile( config:PackageFileConfig, opts?: PackageFileOpts['readme'] ) {

		try {

			if ( opts == false ) return

			const {
				publicPkg, info,
			} = config

			//////////////////////////////////////////////////////////////////////////////
			// README (REPO)
			const DOCS_ID = 'docs'

			let content               = '',
				precontent            = ''
			const readmedocsPath      = joinPath( this.#coreDir, DOCS_ID, FILE_NAME.README )
			const readmedocsLowerPath = joinPath( this.#coreDir, DOCS_ID, FILE_NAME.README.toLowerCase() )

			if ( await existsFile( readmedocsPath ) )
				content += await readFile( readmedocsPath ) + '\n'
			else if ( await existsFile( readmedocsLowerPath ) )
				content += await readFile( readmedocsLowerPath ) + '\n'

			if ( publicPkg.id === ID.core ) {

				const wsDocsPath = joinPath( this.#coreDir, DOCS_ID, FILE_NAME.WS )
				precontent      += await existsFile( wsDocsPath ) ? ( await readFile( wsDocsPath ) + '\n' ) : ''

			}
			else {

				const docsPath = joinPath( publicPkg.package.dir, DOCS_ID, FILE_NAME.PRE_README )
				precontent    += await existsFile( docsPath ) ? ( await readFile( docsPath ) + '\n' ) : ''

			}
			content += info.more

			const localPkgBanner  = this.utils.pkg?.extra?.bannerURL && typeof this.utils.pkg?.extra?.bannerURL === 'string' ? this.utils.pkg?.extra?.bannerURL as string : undefined
			const localBanner     = joinPath( this.utils.wsDir, 'docs/public/banner.png' )
			const remoteBannerURL = joinUrl( this.#REPO_URL, 'blob/main/docs/public/banner.png?raw=true' )
			const bannerUrl       = localPkgBanner ? localPkgBanner : ( await existsFile( localBanner ) ? remoteBannerURL : undefined )

			const banner = bannerUrl
				? `[![BANNER](${bannerUrl})](${this.#corePkg.homepage})`
				: ''

			const contributorMd = await this.#getContributorsMarkdown( publicPkg.data )
			const partials      = this.partial
			const templates     = this.template
			const setReadmeFile = async ( i:string, o: string ) => await this.#templates.get( {
				input  : i,
				output : o,
				const  : {
					libPkg       : publicPkg.data,
					info,
					title        : publicPkg.title,
					desc         : publicPkg.data.description,
					banner       : banner,
					contributors : contributorMd ? contributorMd : '',
					// pkgBadges    : pkgBadges( {
					// 	repoName : getRepoName( this.#corePkg ),
					// 	pkgName  : publicPkg.name,
					// } ),
					libPkgBadges : createMdLinks( [
						{
							URL    : joinUrl( 'https://www.npmjs.com/package', publicPkg.name ),
							imgURL : createBadgeURL( {
								path      : 'bundlejs/size/' + publicPkg.name,
								style     : 'for-the-badge',
								color     : 'orange',
								label     : 'Minimized size',
								logoColor : 'white',
							} ),
							name : 'NPM package minimized gzipped size',
						},
						{
							URL    : joinUrl( 'https://www.npmjs.com/package', publicPkg.name ),
							imgURL : createBadgeURL( {
								path      : 'npm/unpacked-size/' + publicPkg.name + '/' + publicPkg.data.version,
								style     : 'for-the-badge',
								color     : 'orange',
								logoColor : 'white',
							} ),
							name : 'NPM Unpacked Size',
						},
						...( opts?.markdownLinks ? opts.markdownLinks( publicPkg ) : [] ),
					] ),
				},
				partial : {
					footer       : { input: partials.footer },
					content      : { input: content },
					precontent   : { input: precontent },
					installation : { input: partials.installation },
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
				...( opts?.props || {} ),
			} )

			await setReadmeFile( templates.readmePkg, publicPkg.package.readmeFile )

			//////////////////////////////////////////////////////////////////////////////
			// WORKSPACE README
			//////////////////////////////////////////////////////////////////////////////
			if ( publicPkg.id === ID.core )
				await setReadmeFile( templates.readmePkg, joinPath( this.utils.wsDir, FILE_NAME.README ) )

		}
		catch ( e ) {

			throw new Error( `Failed to generate readme.\n - ${e instanceof Error ? e.message : e?.toString()}` )

		}

	}

	async #setPkgFile( config:PackageFileConfig, opts?: PackageFileOpts ) {

		await ensureDir( config.publicPkg.docs.dir )
		const setDocs = async ( ) => {

			//////////////////////////////////////////////////////////////////////////
			// API (DOCS)
			await this.setPackageApiFile( config, opts?.api )
			//////////////////////////////////////////////////////////////////////////
			// INDEX (DOCS)
			await this.setPackageIndexFile( config, opts?.index )

		}
		await Promise.all( [
			//////////////////////////////////////////////////////////////////////////
			// PACKAGE.JSON (OVERRIDE)
			this.setPackageJSONFile( config, opts?.packages ),

			//////////////////////////////////////////////////////////////////////////
			// DOCS FILES
			this.setPackageExamplesFile( config, opts?.examples ),
			setDocs(),
			/////////////////////////////////////////setDocs/////////////////////////////////
			// README
			this.setPackageReadmeFile( config, opts?.readme ),
		] )

	}

	/**
	 *
	 * Set the files for each package in the workspace.
	 *
	 * @param   {object}        [opts] - Options.
	 * @returns {Promise<void>}
	 */
	async setPackageFiles( opts?: PackageFileOpts ) {

		try {

			const wsData = await this.getWorkspacePublicPackagesData()

			const publicPkgs = wsData.data
			const info       = await this.getMarkdownInfo()
			const tasks      = publicPkgs.map( async publicPkg => {

				try {

					await this.#setPkgFile( {
						wsData,
						publicPkg,
						info,
					}, opts )

				}
				catch ( e ) {

					throw new Error( `Failed in package ${publicPkg.name}.\n - ${e instanceof Error ? e.message : e?.toString()}\n` )

				}

			} )
			await Promise.all( tasks )

		}
		catch ( e ) {

			throw new Error( `Failed to generate package files.\n - ${e instanceof Error ? e.message : e?.toString()}` )

		}

	}

	async #run( opts?: RunOpts ) {

		//////////////////////////////////////////////////////////////////////////////
		// DOCS INDEX
		//////////////////////////////////////////////////////////////////////////////
		if ( opts?.index !== false ) await this.setIndexFile( opts?.index )
		if ( opts?.guideIndex !== false ) await this.setGuideIndexFile( opts?.guideIndex )
		if ( opts?.guideSectionIndex !== false ) await this.setGuideSectionIndexFile( opts?.guideSectionIndex )
		if ( opts?.contributors !== false ) await this.setContributorsFile( opts?.contributors )

		//////////////////////////////////////////////////////////////////////////////
		// OWN PACAKGE
		//////////////////////////////////////////////////////////////////////////////
		if ( opts?.packages !== false ) await this.setPackageFiles( opts?.packages )

	}

	/**
	 * Create package docs simultaneously.
	 *
	 * @param   {RunOpts}       [opts] - Optional options.
	 * @returns {Promise<void>}        - Resolves when all docs are created.
	 */
	async run( opts?: RunOpts ) {

		await this.utils.catchFn( this.#run( opts ) )

	}

}

/**
 * Create package docs simultaneously.
 *
 * @param   {PredocsConfig}                       [opts] - Optional opts to pass to {@link Predocs}.
 * @returns {import('@dovenv/core').DovenvConfig}        - Dovenv plugin config.
 */
export const predocsPlugin = ( opts?: PredocsConfig | ( ( data:Predocs ) => Promise<void> ) ) => {

	const predocsPartsObject = {
		'packages'            : undefined,
		'guide-index'         : undefined,
		'guide-section-index' : undefined,
		'index'               : undefined,
		'contributors'        : undefined,
	}
	const OptsAreFunction    = typeof opts === 'function'
	return defineConfig( { custom : { predocs : {
		desc : 'Create package docs simultaneously',
		opts : !OptsAreFunction
			? { key : {
				alias : 'k',
				desc  : 'Set a pattern of braces to build only those parts. Available keys: (' + Object.keys( predocsPartsObject ).join( ', ' ) + ')',
				type  : 'array',
			} }
			: undefined,
		fn : async ( {
			utils, opts: flags,
		} ) => {

			if ( OptsAreFunction ) {

				const predocs = new Predocs( {
					opts : undefined,
					utils,
				} )
				await opts( predocs )
				return

			}

			const getActiveOpts = async (): Promise<Parameters<Predocs['run']>[0]> => {

				if ( !flags?.key ) return

				const keys = await utils.getOptsKeys( {
					input   : predocsPartsObject,
					pattern : flags.key as string[],
				} )
				// Exit if keys is undefined Because no keys were found and the user dont want build all.
				if ( !keys ) return utils.process.exit( )
				const result: Record<string, false | undefined> = {}

				for ( const key in predocsPartsObject )
					if ( Object.prototype.hasOwnProperty.call( predocsPartsObject, key ) )
						result[kebab2Camel( key )] = !keys.includes( key ) ? false : undefined

				return result

			}

			const predocs = new Predocs( {
				opts,
				utils,
			} )

			await predocs.run( await getActiveOpts() )

		},
	} } } )

}
