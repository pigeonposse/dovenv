import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
	relativePath,
} from '@dovenv/core/utils'

import { docsPlugin } from '../../src/main'

const currDir     = joinPath( getCurrentDir( import.meta.url ) )
const pkgDir      = joinPath( currDir, '..', '..' )
const name        = 'no-logo-example'
const pluginFiles = [ 'api', 'index' ]
const sidebar     = [
	{
		text  : 'Introduction',
		items : [
			{
				text : `What is ${name}?`,
				link : `/guide/`,
			},
		],
	},
	{
		text  : 'Plugin',
		items : pluginFiles.map( l => ( {
			text : l,
			link : `/guide/${l}/`,
		} ) ),
	},
]

export default defineConfig( docsPlugin( {
	input  : relativePath( process.cwd(), joinPath( currDir, 'docs' ) ),
	output : relativePath( process.cwd(), joinPath( pkgDir, 'build', name ) ),
	name,
	// input  : './docs',
	styles : { color : {
		primary   : '#e10c68',
		secondary : '#fc8c2f',
		terciary  : '#1d9bf7',
		dark      : {
			bg     : '#000',
			bgAlt  : '#0b0b0d',
			bgSoft : '#0d0c10',
		},
	} },
	css : `
// .vp-doc p:has( > a) {
// display: flex;
// gap: 10px;
// }
		`,
	pwa          : false,
	// favicon      : '/favicon.png',
	// logo         : '/logo.png',
	changelogURL : false,
	npmURL       : false,
	sidebar      : {
		'/guide/'       : sidebar,
		'/todo/'        : sidebar,
		'/contributors' : sidebar,
	},
	autoSidebar : {
		reference : false,
		intro     : false,
	},
	vitepress : { ignoreDeadLinks: true },
} ) )
