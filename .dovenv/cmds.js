import { defineConfig } from '../packages/core/dist/main.mjs'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
	open,
	getBaseName,
	exec,
	getObjectFromYAMLFile,
	getPaths,
	color,
	box,
	table,
	getMatch,
	existsPath,
	removeDirIfExist,
} from '../packages/utils/dist/main.mjs'

const currDir      = getCurrentDir( import.meta.url )
const workspaceDir = joinPath( currDir, '..' )
const pkg          = await getObjectFromJSONFile( joinPath( workspaceDir, 'package.json' ) )

const cmdTable = data => table(
	data,
	{
		drawHorizontalLine : () => false,
		drawVerticalLine   : () => false,
	},
)
const cmdBox   = ( {
	data, title = undefined, border = true, dim = true,
} ) => box( data, {
	title,
	dimBorder : dim,
	padding   : {
		top   : 1,
		left  : 1,
		right : 1,
	},
	borderStyle : !border ? 'none' : 'single',
} )

export const customConfig = defineConfig( {
	const : {
		pkg : pkg,
		workspaceDir,
	},
	name   : 'DOVENV WORKSPACE',
	desc   : 'ToolKit for dovenv repository that uses the "dovenv" core and "banda" theme.',
	custom : {
		donate : {
			desc : 'Donate to pigeonposse.',
			fn   : async () => {

				const res = await open( 'https://opencollective.com/pigeonposse' )
				console.log( res )

			},

		},
		audit : {
			desc     : 'Audit the workspace dependencies.',
			settings : { wrapConsole: false },
			fn       : async (  ) => {

				await exec( 'pnpm audit' )
				console.info( 'Packages outdated:' )
				await exec( 'pnpm -r outdated' )

			},
		},
		cmdsinfo : {
			desc : 'Commands info',
			fn   : async (  ) => {

				const cmds = [
					{
						desc : 'Removes unreferenced packages from the store.',
						cmd  : 'pnpm store prune',
						info : 'https://pnpm.io/cli/store#prune',
					},
					{
						desc : 'Removes unnecessary packages.',
						cmd  : 'pnpm prune',
						info : 'https://pnpm.io/cli/prune',
					},
					{
						desc : 'Deletes metadata cache for the specified package(s).',
						cmd  : 'pnpm cache delete',
						info : 'https://pnpm.io/cli/cache-delete',
					},
					{
						desc : 'Checks for outdated packages.',
						cmd  : 'pnpm -r outdated',
						info : 'https://pnpm.io/cli/outdated',
					},
					{
						desc : 'Checks for known security issues with the installed packages.',
						cmd  : 'pnpm audit',
						info : 'https://pnpm.io/cli/audit',
					},
					{
						desc : 'Find where a package is in node_modules.',
						cmd  : 'find node_modules/.pnpm -name "*dovenv*"',
					},
				]

				let data = '\n\n'
				for ( const cmd of cmds ) {

					data += cmdTable( [
						[ 'Command', color.yellow( cmd.cmd ) ],
						[ 'Description', cmd.desc ],
						[ 'Info', color.gray.dim.italic( cmd.info  || 'none' ) ],
					] ) + '\n\n'

				}

				console.log( cmdBox( {
					data,
					title : 'Commands',
				} ) )

			},
		},
		reinstall : {
			desc : 'Reinstall the workspace',
			fn   : async () => {

				const paths = await getPaths( [ joinPath( workspaceDir, '**/node_modules' ) ], {
					onlyDirectories : true,
					ignore          : [ '**/node_modules/**/node_modules' ],
				} )
				if ( paths ) for ( const path of paths ) {

					console.info( `Removing ${path}` )
					await removeDirIfExist( path )

				}
				// await exec( 'pnpm store prune' )
				// await exec( 'pnpm cache delete' )
				await exec( 'pnpm i' )

			},
		},
		scripts : {
			desc : 'list workspace scripts with pnpm',
			opts : { keys : {
				alias : 'k',
				type  : 'array',
				desc  : 'filter by package name pattern',
			} },
			fn : async ( { opts } ) => {

				const monoPath = joinPath( workspaceDir, 'pnpm-workspace.yaml' )
				const exists   = await existsPath( monoPath )
				const packages = exists ? ( await getObjectFromYAMLFile( monoPath ) ).packages : []
				packages.push( '.' )

				let paths = await getPaths( packages.map( p => joinPath( workspaceDir, p, 'package.json' ) ) )

				console.log( cmdBox(  {
					title : 'Info',
					data  : cmdTable(
						[ [ `Monorepo:`, color.green( exists ) ], [ `Total package.json:`, color.green( paths.length ) ] ],
					),
				} ) + '\n' )

				if ( opts?.keys ) paths = getMatch( paths, opts.keys )
				if ( !paths.length ) return console.warn( 'No packages found in workspace with patterns:', opts?.keys?.join( ', ' ) || '' )
				for ( const path of paths ) {

					const data = await getObjectFromJSONFile( path )

					const scripts = []
					if ( data.scripts ) {

						for ( const key in data.scripts ) {

							scripts.push( [ color.magentaBright(  key  ), color.dim( data.scripts[key] ) ] )

						}

					}
					const tableContent = [
						[ color.white( 'Path' ), color.dim.italic.gray( path ) ],
						...( scripts.length
							? [ [ '', '' ], ...scripts ]
							: [] ),
					]
					const content      = table( tableContent, {
						singleLine         : true,
						drawHorizontalLine : () => false,
						drawVerticalLine   : () => false,
					} )

					console.log( cmdBox(  {
						data   : content,
						title  : color.cyanBright( data.name ),
						border : false,
						dim    : false,
					} )  )

				}

			},
		},
	},
	transform : { packages : {
		input : [
			'packages/{plugin,theme,config}/*/package.json',
			'packages/utils/package.json',
			'packages/core/package.json',
		],

		fn : async ( {
			path, content, const: consts,
		} ) => {

			const name = getBaseName( path.replace( 'package.json', '' ) )

			const basePaths = {
				utils  : _ => 'utils',
				core   : _ => 'core',
				theme  : name => `theme/${name}`,
				config : name => `config/${name}`,
				plugin : name => `plugin/${name}`,
			}

			const key       = Object.keys( basePaths ).find( key => path.includes( key ) ) || 'plugin'
			const ID        = basePaths[key]( name )
			const setWSdata = () => {

				const pkg = consts.pkg
				if ( !pkg ) throw new Error( `dovenv configuration must have "pkg" key in consts with the data of ws package` )
				if ( !pkg.repository.url ) throw new Error( `"repository.url" is required for exists in dovenv "pkg" consts` )
				else if ( !pkg.license ) throw new Error( `"license" is required for exists in dovenv "pkg" consts` )
				else if ( !pkg.funding ) throw new Error( `"funding" is required for exists in dovenv "pkg" consts` )
				else if ( !pkg.bugs ) throw new Error( `"bugs" is required for exists in dovenv "pkg" consts` )
				return {
					repoUrl : pkg.repository.url,
					license : pkg.license,
					funding : pkg.funding,
					bugs    : pkg.bugs,
				}

			}
			const wsData = setWSdata()
			const object = JSON.parse( content )

			if ( !object.private && !object.keywords ) throw new Error( `keywords are required for package: ${path}` )
			else if ( !object.private && object.keywords && ( !object.keywords.includes( 'pigeonposse' ) || !object.keywords.includes( 'pp' ) ||  !object.keywords.includes( 'dovenv' ) ) )
				throw new Error( `keywords must include 'pigeonposse', 'pp' and 'dovenv' for package: ${path}` )

			const data = {
				...object,
				homepage   : `https://dovenv.pigeonposse.com/guide/${ID}`,
				repository : {
					type      : 'git',
					url       : wsData.repoUrl,
					directory : `packages/${ID}`,
				},
				license : wsData.license,
				funding : wsData.funding,
				bugs    : wsData.bugs,
				...( consts.pkg.author ? { author: consts.pkg.author } : {} ),
			}

			return JSON.stringify( data, undefined, '\t' ) + '\n'

		},
	} },
} )
