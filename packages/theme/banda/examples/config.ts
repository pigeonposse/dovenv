import { defineConfig } from '@dovenv/core'
// import {
// 	resolvePath,
// 	joinPath,
// 	catchExecOutput,
// } from '@dovenv/core/utils'

import { bandaTheme } from '../src/main'

// const exampleFolder = resolvePath( joinPath( 'examples' ) )
// const imageFolder   = joinPath( exampleFolder, 'images' )
// const termFolder    = joinPath( exampleFolder, 'termgif' )
// // const imagePath     = joinPath( imageFolder, 'favicon.png' )
// const [ dovenvError, dovenvIn ] = await catchExecOutput( 'pnpm --help' )
// if ( dovenvError ) throw dovenvError

export default defineConfig( bandaTheme( {
	lint      : undefined,
	workspace : { info : { instructions : `## Pre-requisites
project needs the following tools to work:
- "node" > 20 installed
- "pnpm" > 9 installed
- "gh" > 2 installed
- "git" > 2 installed
## Init workspace
pnpm install` } },
	// media : {
	// 	min : {
	// 		images : {
	// 			input  : [ joinPath( imageFolder, '*' ) ],
	// 			output : joinPath( imageFolder, 'dest' ),
	// 			opts   : { png: true },
	// 		},
	// 		gifs : {
	// 			input  : [ joinPath( termFolder, '**/*.gif' ) ],
	// 			output : joinPath( termFolder, 'compress' ),
	// 			opts   : { gif: { optimizationLevel: 3 } },
	// 		},
	// 	},
	// 	codeimage : {
	// 		main : {
	// 			input : joinPath( exampleFolder, 'main.ts' ),
	// 			flags : [ '--interactive' ],
	// 		},
	// 		help : {
	// 			input : dovenvIn,
	// 			flags : [ '--interactive' ],
	// 		},
	// 	},
	// 	termgif : { test : {
	// 		configPath : joinPath( termFolder, 'test.yml' ),
	// 		output     : joinPath( termFolder, 'test-record' ),
	// 	// command    : 'zsh',
	// 	// quality    : 100,
	// 	} },
	// },
} ) )
