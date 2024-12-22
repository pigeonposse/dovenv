import { defineConfig } from '@dovenv/core'
import {
	getDirName,
	getObjectFromJSONFile,
	yaml,
	joinPath,
	writeFile,
	process,
	ensureDir,
	joinUrl,
	existsFile,
	geMDTocString,
	color,
	capitalize,
} from '@dovenv/core/utils'
import {
	workspace,
	templates as template,
	convert,
	examples,
} from '@dovenv/theme-pigeonposse'

import CONSTS from './const'

import type { PackageJSON } from '@dovenv/core/utils'

const {
	docsRoute,
	ICON,
	ID,
	TYPE,
	REPO_URL,
	pkg: wsPkg,
	corePkg,
} = CONSTS

const examplesFileName = `examples.md`
const apiFileName      = `api.md`
const indexFileName    = `index.md`
const wsileName        = `ws.md`
const contrFileName    = `contributors.md`

export const getPublicPackageData = async ( pkgs: string[], wsDir: string ) => {

	const docsDir      = joinPath( wsDir, 'docs' )
	const guideDir     = joinPath( docsDir, docsRoute.guide )
	const packagesPath = 'packages'
	const docsUrl      = CONSTS.pkg.homepage || '/'
	return {
		docsDir,
		docsGuideDir : guideDir,
		urlGuidePath : docsRoute.guide,
		url          : docsUrl,
		packagesPath,
		data         : ( await Promise.all( pkgs.map( async p => {

			const pkgData = await getObjectFromJSONFile<PackageJSON>( p )
			if ( !pkgData || pkgData.private ) return

			const type = p.includes( TYPE.plugin )
				? TYPE.plugin
				: p.includes( TYPE.theme )
					? TYPE.theme
					: p.includes( TYPE.config )
						? TYPE.config
						: TYPE.lib

			const id = p.split( '/' ).at( -2 ) || process.exit()

			const libName = capitalize( wsPkg.extra?.productName || wsPkg.extra.id || wsPkg.name )

			const title = ( type === TYPE.lib && id !== ID.core
				? `${libName} ${capitalize( id )} Package`
				: type === TYPE.lib
					? libName
					: ( `${capitalize( id )} - ${libName} ${capitalize( type )}` ) )

			const icon =  type === TYPE.lib && ( id in ICON )
				? ICON[id as keyof typeof ICON]
				: type !== TYPE.lib && ( type in ICON )
					? ICON[type]
					: undefined

			const pathID = type !== TYPE.lib ? ( `${type}/${id}` ) : id

			const dir            = getDirName( p )
			const srcTs          = joinPath( dir, 'src', 'main.ts' )
			const srcJs          = joinPath( dir, 'src', 'main.js' )
			const tsconfigPath   = joinPath( dir, 'tsconfig.json' )
			const readmePath     = joinPath( dir, 'README.md' )
			const docsDir        = joinPath( guideDir, pathID )
			const docsPath       = joinPath( '/', docsRoute.guide, pathID )
			const apiPath        = joinPath( docsDir, apiFileName )
			const examplePath    = joinPath( docsDir, examplesFileName )
			const indexPath      = joinPath( docsDir, indexFileName )
			const examplesFile   = joinPath( dir, 'examples', 'info.yml' )
			const docsFile       = joinPath( dir, 'docs', indexFileName )
			const isTs           = await existsFile( srcTs )
			const existsExamples = await existsFile( examplesFile )
			const existsDocs     = await existsFile( docsFile )
			const src            = isTs ? srcTs : srcJs
			const existsApi      = type == 'config' && !isTs ? false : true

			return {
				type,
				id,
				pathID,
				title,
				icon    : icon,
				name    : pkgData.name || '',
				data    : pkgData,
				// @ts-ignore
				repoURL : joinPath( pkgData.repository?.url, 'tree/main', pkgData?.repository?.directory ),
				package : {
					relativeDir        : joinPath( `${packagesPath}/${pathID}` ),
					dir,
					srcFile            : src,
					packageJsonFile    : p,
					tsconfigFile       : isTs ? tsconfigPath : undefined,
					readmeFile         : readmePath,
					docsFile           : existsDocs ? docsFile : undefined,
					examplesConfigFile : existsExamples ? examplesFile : undefined,
					isTs,
				},
				docs : {
					dir     : docsDir,
					urlPath : {
						api      : existsApi ? joinUrl( docsPath, apiFileName.replace( '.md', '' ) ) : undefined,
						examples : existsExamples ? joinUrl( docsPath, examplesFileName.replace( '.md', '' ) ) : undefined,
						index    : docsPath,
					},
					apiFile      : existsApi ? apiPath : undefined,
					examplesFile : existsExamples ? examplePath : undefined,
					indexFile    : indexPath,
				},
			}

		} ) ) ).filter( p => p !== undefined ), // remove undefined
	}

}
export const getPublicPackageByType = ( data: Awaited<ReturnType<typeof getPublicPackageData>>['data'] ) => {

	type GroupedData = Record<keyof typeof TYPE, typeof data>

	const grouped = data.reduce<GroupedData>( ( acc, item ) => {

		if ( !acc[item.type] ) acc[item.type] = []
		acc[item.type].push( item )
		return acc

	}, {} as GroupedData );

	( Object.keys( grouped ) as Array<keyof typeof TYPE> ).forEach( key => {

		grouped[key] = grouped[key].sort( ( a, b ) => {

			if ( a.type === TYPE.lib && a.id === ID.core ) return -1
			if ( b.type === TYPE.lib && b.id === ID.core ) return 1

			return 0

		} )

	} )

	const {
		config,  ...rest
	} = grouped
	return {
		...rest,
		config,
	}

}

export const preDocsConfig = defineConfig( { custom : { predocs : {
	desc : 'Create package docs simultaneously',
	fn   : async ( { config } ) => {

		//////////////////////////////////////////////////////////////////////////////
		// GET DATA
		//////////////////////////////////////////////////////////////////////////////

		const wsInstance   = new workspace.Workspace( undefined, config )
		const examplesInst = new examples.Examples( undefined, config )
		const tempInstance = new template.Templates( undefined, config )
		const cuurentDir   = process.cwd()
		const wsDir        = ( config?.const?.wsDir || config?.const?.workspaceDir || cuurentDir ) as string
		const dataDir      = joinPath( cuurentDir, 'data' )
		const partialsDir  = joinPath( dataDir, 'partials' )
		const templatesDir = joinPath( dataDir, 'templates' )
		const wsIndexFile  = joinPath( CONSTS.coreDir, wsileName )

		const getLogTitle = ( t: string ) => `${color.inverse( ` ${t} ` )}\n`

		const pkgPaths      = await wsInstance.getPkgPaths()
		const data          = await getPublicPackageData( pkgPaths, wsDir )
		const publicPkgs    = data.data
		const docsDir       = data.docsDir
		const guideDir      = data.docsGuideDir
		const docsIndexFile = joinPath( docsDir, indexFileName )
		const docsContrFile = joinPath( docsDir, contrFileName )

		const generateMarkdownInfo = () => {

			const publicPkgGrouped = getPublicPackageByType( publicPkgs )

			const res = {
				more          : '## More\n\n',
				[TYPE.plugin] : `## ${ICON[TYPE.plugin]} Plugins\n\n`,
				[TYPE.theme]  : `## ${ICON[TYPE.theme]} Themes\n\n`,
				[TYPE.config] : `## ${ICON[TYPE.config]} Config\n\n`,
				[TYPE.lib]    : `## Other tools\n\n`,
			}

			for ( const [ type, items ] of Object.entries( publicPkgGrouped ) ) {

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

			return res

		}

		const info = generateMarkdownInfo()

		//////////////////////////////////////////////////////////////////////////////
		// DOCS INDEX
		//////////////////////////////////////////////////////////////////////////////

		console.info( getLogTitle( 'docs index(s)' ) )

		await tempInstance.get( {
			input  : joinPath( templatesDir, contrFileName ),
			output : docsContrFile,
		} )

		await tempInstance.get( {
			input   : joinPath( templatesDir, indexFileName ),
			output  : docsIndexFile,
			const   : { libPkg: corePkg },
			partial : { installationGroup: { input: joinPath( partialsDir, 'installation-group.md' ) } },
			hook    : { before : async data => {

				const name         = wsPkg.extra.productName || wsPkg.extra.id || wsPkg.name
				const layoutConfig = {
					layout : 'home',
					hero   : {
						name    : name.toUpperCase(),
						tagline : wsPkg.extra.shortDesc,
						text    : wsPkg.extra.action,
						image   : {
							src : '/logo.png',
							alt : name,
						},
						actions : [
							{
								theme : 'brand',
								text  : 'Get started',
								link  : `/${docsRoute.guide}`,
							},
							{
								theme : 'alt',
								text  : 'View on GitHub',
								link  : REPO_URL,
							},
						],
					},
					features : [
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

				data.const.docsIndex = yaml.serialize( layoutConfig )

				return data

			} },
		} )

		// section index
		for ( const v of Object.values( TYPE ) ) {

			if ( v === TYPE.lib ) continue
			const currPath = joinPath( guideDir, v, indexFileName )
			await writeFile( currPath, info[v] )

		}

		// guide index
		if ( await existsFile( wsIndexFile ) ) {

			await tempInstance.get( {
				input  : wsIndexFile,
				output : joinPath( guideDir, indexFileName ),
				const  : { libPkg: corePkg },
			} )

		}

		//////////////////////////////////////////////////////////////////////////////
		// WORKSPACE README
		//////////////////////////////////////////////////////////////////////////////

		// TODO

		//////////////////////////////////////////////////////////////////////////////
		// OWN PACAKGE
		//////////////////////////////////////////////////////////////////////////////

		for ( const publicPkg of publicPkgs ) {

			console.info( getLogTitle( publicPkg.name || '' ) )

			await ensureDir( publicPkg.docs.dir )

			//////////////////////////////////////////////////////////////////////////////
			// PACKAGE.JSON (OVERRIDE)

			const data = {
				...publicPkg.data,
				homepage   : joinUrl( wsPkg.homepage || '', publicPkg.docs.urlPath.index ),
				repository : {
					type      : 'git',
					url       : REPO_URL,
					directory : publicPkg.package.relativeDir,
				},
				license : wsPkg.license,
				funding : wsPkg.funding,
				bugs    : wsPkg.bugs,
				...( wsPkg.author ? { author: wsPkg.author } : {} ),
			}

			await writeFile(
				publicPkg.package.packageJsonFile,
				JSON.stringify( data, undefined, '\t' ) + '\n',
			)

			//////////////////////////////////////////////////////////////////////////////
			// INDEX (DOCS)

			await tempInstance.get( {
				input   : publicPkg.package.docsFile  ? publicPkg.package.docsFile : `# ${publicPkg.name}\n\n${publicPkg.data.description}\n\n{{partial.installation}}\n`,
				output  : publicPkg.docs.indexFile,
				const   : { libPkg: publicPkg.data },
				partial : { installation: { input: joinPath( partialsDir, 'installation-group.md' ) } },
				hook    : { afterPartials : async data => {

					let finalcontent = `## More\n\n`

					if ( publicPkg.docs.examplesFile ) finalcontent += `- ${ICON.examples} [Examples](${examplesFileName})\n`
					if ( publicPkg.docs.apiFile ) finalcontent += `- ${ICON.api} [API Docs](${apiFileName})\n`
					finalcontent += `- ${ICON.package} [NPM](https://www.npmjs.com/package/${publicPkg.data.name})\n`
					data.content += '\n' + finalcontent

					return data

				} },
			} )

			//////////////////////////////////////////////////////////////////////////////
			// EXAMPLES (DOCS)

			if (  publicPkg.docs.examplesFile && publicPkg.package.examplesConfigFile )
				await examplesInst.fromConfig( {
					input  : publicPkg.package.examplesConfigFile,
					output : publicPkg.docs.examplesFile,
					title  : `\`${publicPkg.name}\` - Examples`,
				} )

			//////////////////////////////////////////////////////////////////////////////
			// API (DOCS)

			if ( publicPkg.docs.apiFile && publicPkg.package.isTs )  {

				const ts2md = new convert.Typescript2Markdown( {
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

				const apiContent = ( ( await ts2md.run() )[0].content )
					.replaceAll( '](index.md#', '](#' ) // this is because typedoc adds index.md# to the links

				await writeFile( publicPkg.docs.apiFile, `# \`${publicPkg.name}\` - Api documentation\n\n` + apiContent )

			}

			//////////////////////////////////////////////////////////////////////////////
			// README (REPO)

			const setReadmeFile = async ( i:string, o: string ) => await tempInstance.get( {
				input  : i,
				output : o,
				const  : {
					libPkg : publicPkg.data,
					info,
					title  : publicPkg.title,
					desc   : publicPkg.data.description,
				},
				partial : {
					footer : { input: joinPath( partialsDir, 'footer.md' ) },
					more   : { input: info.more },
				},
				hook : { afterPartials : async data => {

					data.const.toc = await geMDTocString( {
						input           : data.content,
						title           : 'Table of contents',
						removeH1        : true,
						maxHeadingLevel : 4,
					} )

					return data

				} },
			} )

			await setReadmeFile( joinPath( templatesDir, 'readme.md' ), publicPkg.package.readmeFile )

			// WORKSPACE README
			if ( publicPkg.id === ID.core )
				await setReadmeFile( joinPath( templatesDir, 'readme.md' ), joinPath( wsDir, 'README.md' ) )

		}

	},
} } } )
