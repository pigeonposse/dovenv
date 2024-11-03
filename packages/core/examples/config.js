import {
	existsDir,
	existsFile,
	joinPath,
	setDirectoryTree,
	box,
	generateASCII,
	getObjectFrom,
} from '@dovenv/utils'

import { defineConfig } from '../dist/main.mjs'
import pkg              from '../package.json'

const setStructure = () => '\n' + box( setDirectoryTree(  {
	'.vscode' : {
		'settings.json'   : null,
		'extensions.json' : null,
	},
	'docs'             : { '*.md': null },
	'packages'         : { '**': null },
	'.gitignore'       : null,
	'.pigeonposse.yml' : null,
	'LICENSE'          : null,
	'package.json'     : null,
	'README.md'        : null,
} ),
{
	padding     : 1,
	title       : 'Workspace Structure',
	borderStyle : 'double',
	borderColor : 'gray',
	dimBorder   : true,
},
)

export default defineConfig( {
	name   : 'PROJECT WORKSPACE',
	desc   : 'This is a project workspace example',
	custom : { structure : {
		desc : 'Set structure for the workspace',
		fn   : async () => console.log( setStructure() ),
	} },
	const : {
		pkg  : pkg,
		mark : `\n${generateASCII( {
			name  : pkg.name,
			title : 'pigeonposse',
			font  : 'ANSI Shadow',
		} )}\n`,
		// @ts-ignore
		custom : async () => {

			// throw new Error( 'Custom error' )
			const res = await getObjectFrom( 'https://raw.githubusercontent.com/pigeonposse/super8/main/.pigeonposse.yml' )
			// @ts-ignore
			return res.web[0]

		},
	},
	template : {
		pkg : {
			input  : 'package.json',
			output : [ 'packages/**/package.json', '!packages/**/node_modules/*' ],
		},
		readme : {
			input  : 'README.md',
			output : [ 'README.md' ],
		},
	},
	// after templates or include inside templates (?)
	// partials : {
	// 	pigeonposse : {},
	// 	reamde      : {
	// 		output  : 'README.md',
	// 		content : [],
	// 	},
	// },
	// transform : {
	// 	pkg : {
	// 		input  : 'package.json',
	// 		output : [ 'packages/**/package.json', '!packages/**/node_modules/*' ],
	// 		part: async (in, out) => {
	// 			out.name = in.name
	// 			out.repository = out.repository
	// 			out.bugs = in.bugs

	// 			return out
	// 		},
	// 	},
	// 	readme : {
	// 		input  : 'package.json',
	// 		output : [ 'packages/**/package.json', '!packages/**/node_modules/*' ],
	// 	},
	// },
	check : {
		dirs : { packages : {
			desc     : 'Repo packages structure.',
			patterns : [
				'./packages/*',
				'!./packages/{plugin,config,templates}',
				'./packages/{plugin,config,templates}/*',
			],
			validateAll : async ( { paths } ) => {

				if ( paths.length === 0 ) throw new Error( 'No packages found' )

			},
			validate : async ( { path } ) => {

				const files  = [ joinPath( path, 'README.md' ) ]
				const dirs   = [ joinPath( path, 'src' ) ]
				const noDirs = [ joinPath( path, 'docs' ) ]

				for ( const file of files ) {

					const exists = await existsFile( file )
					if ( !exists ) throw new Error( `File [${file}] must exist` )

				}

				for ( const dir of dirs ) {

					const exists = await existsDir( dir )
					if ( !exists ) throw new Error( `Directory [${dir}] must exist` )

				}

				for ( const dir of noDirs ) {

					const exists = await existsDir( dir )
					if ( exists ) throw new Error( `Directory [${dir}] must not exist` )

				}

			},

		} },
		files : {
			docs : {
				desc        : 'Documentation structure.',
				patterns    : [ 'docs/*.md' ],
				validateAll : async ( { paths } ) => {

					const validFiles = paths.filter( p =>
						p.endsWith( 'index.md' ) || p.endsWith( 'posts.md' ),
					)
					if ( validFiles.length !== 2 ) throw new Error( 'File [docs/index.md] and [docs/posts.md] must exist' )
					if ( paths.length < 3 ) throw new Error( `File [${paths}] must not exist` )

				},
				validate : async ( {
					path, content,
				} ) => {

					if ( !content ) throw new Error( `File [${path}] must exist` )

				},

			},
			monorepo : {
				desc        : 'Monorepo structure.',
				patterns    : [ 'src/*' ],
				validateAll : async ( { paths } ) => {

					if ( paths.length ) throw new Error( `Directory [src] must not exist because it is a monorepo` )

				},

			},
			required : {
				desc     : 'Monorepo required files.',
				patterns : [
					'LICENSE',
					'README.md',
					'.pigeonposse.yml',
					'package.json',
					'.gitignore',
					'.vscode/settings.json',
					'.vscode/extensions.json',
				],
				validateAll : async ( { paths } ) => {

					if ( paths.length !== 7 )
						throw new Error( `Monorepo must have this structure:\n ${setStructure()}` )

				},

			},
			pkgJson : {
				desc     : 'Schema from repo packages',
				patterns : [ 'packages/*/package.json' ],
				validate : async ( {
					path, content,
				} ) => {

					if ( !content ) throw new Error( `File [${path}] must exist` )
					const c = JSON.parse( content )
					if ( !( 'version' in c ) ) throw new Error( `File [${path}] must have version field` )

				},
			},
		},
	},
} )
