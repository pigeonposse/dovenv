import {
	existsDir,
	existsFile,
	joinPath,
	setDirectoryTree,
	box,
	generateASCII,
	getObjectFrom,
	readFile,
	getCurrentDir,
	replacePlaceholders,
	getPaths,
	getBaseName,
} from '@dovenv/utils'

import pkg              from '../../../package.json'
import { version }      from '../package.json'
import { defineConfig } from '../src/main'

const setStructure = () => '\n' + box( setDirectoryTree(  { structure : {
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
} } ),
{
	padding     : 1,
	title       : 'Workspace Structure',
	borderStyle : 'double',
	borderColor : 'gray',
	dimBorder   : true,
},
)
// const tests        = {
// 	template : {
// 		pkg : {
// 			input  : 'package.json',
// 			output : [ 'packages/**/package.json', '!packages/**/node_modules/*' ],
// 			// partials : {},
// 		},
// 		readme : {
// 			input  : 'README.md',
// 			output : [ 'README.md' ],
// 		},
// 	},

// 	//after templates or include inside templates (?)
// 	partials : {
// 		pigeonposse : {},
// 		reamde      : {
// 			output  : 'README.md',
// 			content : [],
// 		},
// 	},
// 	transform : {
// 		pkg : {
// 			input  : 'package.json',
// 			output : [ 'packages/**/package.json', '!packages/**/node_modules/*' ],
// 			// fn: ( in, out ) => {
// 			// 	return merge( out, in )
// 			// }
// 			// part: async (in: object, out) => {
// 			// 	out.name = in.name
// 			// 	out.repository = out.repository
// 			// 	out.bugs = in.bugs

// 			// 	return out
// 			// },
// 		},
// 		readme : {
// 			input  : 'package.json',
// 			output : [ 'packages/**/package.json', '!packages/**/node_modules/*' ],
// 		},
// 	},
// }
export default defineConfig( {
	name   : 'PROJECT WORKSPACE',
	desc   : 'This is a project workspace example.',
	custom : {
		structure : {
			desc : 'Set structure for the workspace.',
			fn   : async () => console.log( setStructure() ),
		},
		hello : {
			desc : 'Say hello to username',
			opts : {
				name : {
					type     : 'string',
					alias    : 'n',
					describe : 'Name of the user',
					default  : 'John',
				},
				secondName : {
					type     : 'string',
					alias    : 's',
					describe : 'Second name of the user',
					default  : 'Doe',
				},
			},
			examples : [
				{
					desc : 'say hello to John',
					cmd  : '$0 hello --name=John',
				},
			],
			fn : async ( { opts } ) => console.log( `Hello ${opts?.name} ${opts?.secondName}` ),
		},
	},
	const : {
		version,
		pkg,
		mark : `\n${generateASCII( {
			name  : pkg.name,
			title : 'pigeonposse',
			font  : 'ANSI Shadow',
		} )}\n`,
		custom : async () => {

			// throw new Error( 'Custom error' )
			const res = await getObjectFrom( 'https://raw.githubusercontent.com/pigeonposse/super8/main/.pigeonposse.yml' )
			// @ts-ignore
			return res.web[0] as Record<string, unknown>

		},
		template : async () => {

			const templateDir                 = joinPath( getCurrentDir( import.meta.url ), 'templates/*' )
			const paths                       = await getPaths( [ templateDir ], { dot: true } )
			const res: Record<string, string> = {}
			for ( const path of paths ) {

				const key = getBaseName( path )
				res[key]  = await readFile( path, 'utf-8' )

			}

			return res

		},
	},
	transform : {
		readme : {
			input : [ 'README.md' ],
			fn    : async props => {

				const mark = props.const.mark
				// console.log( props )
				return props.content + `\n<!--${mark}-->\n`

			},
		},
		pp : {
			input : [ '.pigeonposse.yml' ],
			fn    : async props => {

				// @ts-ignore
				const ppTemplate =  props.const.template['.pigeonposse.yml']
				const content    = await replacePlaceholders( {
					content : ppTemplate,
					// @ts-ignore
					params  : props.const,
				} )
				return content

			},
		},
	},
	check : {
		packages : {
			desc     : 'Repo packages structure.',
			type     : 'dir',
			patterns : [
				'./packages/*',
				'!./packages/{plugin,config,templates}',
				'./packages/{plugin,config,templates}/*',
			],
			validateAll : async ( { paths } ) => {

				if ( paths.length === 0 ) throw new Error( 'No packages found' )

			},
			validate : async ( { path } ) => {

				// console.log( path, content )
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

		},
		docs : {
			desc        : 'Documentation structure.',
			type        : 'file',
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
			type        : 'file',
			patterns    : [ 'src/*' ],
			validateAll : async ( { paths } ) => {

				if ( paths.length ) throw new Error( `Directory [src] must not exist because it is a monorepo` )

			},

		},
		required : {
			desc     : 'Monorepo required files.',
			type     : 'file',
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
			type     : 'file',
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
} )
