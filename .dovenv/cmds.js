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
} from '../packages/utils/dist/main.mjs'

const currDir      = getCurrentDir( import.meta.url )
const workspaceDir = joinPath( currDir, '..' )
const pkg          = await getObjectFromJSONFile( joinPath( workspaceDir, 'package.json' ) )

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

			},
		},
		reinstall : {
			desc : 'Reinstall the workspace',
			fn   : async () => {

				// something

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

				console.log( box( table(
					[ [ `Monorepo:`, color.green( exists ) ], [ `Total package.json:`, color.green( paths.length ) ] ],
					{
						drawHorizontalLine : () => false,
						drawVerticalLine   : () => false,
					},
				), {
					title     : 'Info',
					dimBorder : true,
					padding   : {
						top   : 1,
						left  : 1,
						right : 1,
					},
				} ) )

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

					console.log( box( content, {
						title   : color.cyanBright( data.name ),
						padding : {
							top   : 1,
							left  : 1,
							right : 1,
						},
						borderStyle : 'none',

					} )  )

				}

			},
		},
	},
	transform : { package : {
		input : [
			'packages/{plugin|themes}/*/package.json',
			'packages/utils/package.json',
			'packages/core/package.json',
		],

		fn : async ( {
			path, content,
		} ) => {

			const name = getBaseName( path.replace( 'package.json', '' ) )

			const paths = name.includes( 'utils' )
				? {
					dir      : 'utils',
					homePath : 'utils',
				}
				: name.includes( 'core' )
					? {
						dir      : 'core',
						homePath : 'core',
					}
					: name.includes( 'themes' )
						? {
							dir      : `themes/${name}`,
							homePath : `themes/${name}`,
						}
						: {
							dir      : `plugin/${name}`,
							homePath : `plugin/${name}`,
						}

			const object = JSON.parse( content )
			const data   = {
				homepage : `https://dovenv.pigeonposse.com/guide/${paths.homePath}`,
				bugs     : {
					url   : 'https://github.com/pigeonposse/dovenv/issues',
					email : 'dev@pigeonposse.com',
				},
				repository : {
					type      : 'git',
					url       : 'https://github.com/pigeonposse/dovenv',
					directory : `packages/${paths.dir}`,
				},
				funding : {
					type : 'individual',
					url  : 'https://pigeonposse.com/?popup=donate',
				},
				license : 'GPL-3.0',
				author  : {
					name  : 'Angelo',
					email : 'angelo@pigeonposse.com',
					url   : 'https://github.com/angelespejo',
				},
			}
			return JSON.stringify( {
				...object,
				...data,
			}, undefined, '\t' ) + '\n'

		},
	} },
} )
