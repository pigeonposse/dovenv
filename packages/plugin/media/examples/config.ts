import { defineConfig } from '@dovenv/core'
import {
	resolvePath,
	joinPath,
	catchExecOutput,
} from '@dovenv/core/utils'

import core            from '../../../../.dovenv/const.js'
import { mediaPlugin } from '../src/main'

const exampleFolder = resolvePath(  'examples' )
const buildFolder   = resolvePath( 'build' )
const imageFolder   = joinPath( exampleFolder, 'images' )
const termFolder    = joinPath( exampleFolder, 'termgif' )
const ciBuildFolder = joinPath( buildFolder, 'codeimage' )
// const imagePath     = joinPath( imageFolder, 'favicon.png' )
const [ dovenvError, dovenvIn ] = await catchExecOutput( 'pnpm --help' )
if ( dovenvError ) throw dovenvError

export default defineConfig(
	{ const: core },
	mediaPlugin( {
	/** Minify config */
		min : {
			images : {
				input  : [ joinPath( imageFolder, '*' ) ],
				output : joinPath( buildFolder, 'images' ),
				opts   : { png: true },
			},
			gifs : {
				input  : [ joinPath( termFolder, '**/*.gif' ) ],
				output : joinPath( buildFolder, 'compress' ),
				opts   : { gif: { optimizationLevel: 3 } },
			},
		},
		/** Generate code Images */
		codeimage : {
			main : {
				input  : joinPath( exampleFolder, 'main.ts' ),
				output : ciBuildFolder,
				flags  : [ '--interactive' ],
			},
			help : {
				input  : dovenvIn,
				output : ciBuildFolder,
				flags  : [ '--interactive' ],
			},
		},
		/** Generate terminal gifs */
		termgif : { test : {
			configPath : joinPath( termFolder, 'test.yml' ),
			output     : joinPath( buildFolder, 'test-record' ),
		// command    : 'zsh',
		// quality    : 100,
		} },

	} ) )
