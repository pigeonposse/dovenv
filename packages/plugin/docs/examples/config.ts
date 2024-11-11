import { fileURLToPath } from '@dovenv/utils'
import {
	faBook,
	faCode,
	faDownload,
	faGithub,
	faGlobe,
	faMedium,
	faX,
} from '@dovenv/utils/client'
import { defineConfig } from 'dovenv'

import { config } from '../src/main'

// const configPath = joinPath( getCurrentDir( import.meta.url ), 'docs.config.js' )

export default defineConfig( config( {
	in   : '../../../docs',
	out  : './build',
	name : 'dovenvvcv',
	// styles : { color : {
	// 	primary   : '#6f42c1',
	// 	secondary : '#f59e0b',
	// } },
	// oldVersions : [
	// 	{
	// 		name : 'v1.0',
	// 		url  : 'https://github.com/pigeonposse/super8/releases/latest',
	// 	},
	// ],

	download : {
		groups : {
			extension : 'Extensions',
			desktop   : 'Apps',
		},
		items : {
			chromiumMv2 : {
				url  : 'https://github.com/pigeonposse/super8/releases/latest/download/super8-chromium-mv2.zip',
				name : 'Chromium (Manifest 2) Extension',
				logo : 'googlechrome',
				type : 'extension',
			},

			macosUniversal : {
				name : 'MacOS App (Universal)',
				logo : 'apple',
				url  : 'https://github.com/pigeonposse/super8/releases/latest/download/Super8_x64.app.tar.gz',
				type : 'desktop',
			},
			macosIntel : {
				name : 'MacOS App (Intel)',
				logo : 'apple',
				url  : 'https://github.com/pigeonposse/super8/releases/latest/download/Super8_x64.app.tar.gz',
				type : 'desktop',
			},
			macosArm : {
				name : 'MacOS App (ARM)',
				logo : 'apple',
				url  : 'https://github.com/pigeonposse/super8/releases/latest/download/Super8_aarch64.app.tar.gz',
				type : 'desktop',
			},
		},
	},
	links : [
		{
			text  : 'Project',
			desc  : 'See more information about the project',
			// icon  : 'home',
			items : [
				{
					text : 'Website',
					icon : faGlobe,
					desc : 'Enjoy our application!',
					link : 'https://super8.pigeonposse.com',
				},
				{
					text : 'Docs',
					icon : faBook,
					desc : 'Read our documentation!',
					link : 'https://docs.super8.pigeonposse.com',
				},
				{
					text : 'Repo',
					icon : faCode,
					desc : 'Star us on GitHub!',
					link : 'https://github.com/pigeonposse/super8',
				},
				{
					text : 'Releases',
					icon : faDownload,
					desc : 'Check out our releases!',
					link : 'https://github.com/pigeonposse/super8/releases',
				},
			],
		},
		{
			text  : 'Collective',
			desc  : 'See more information about the collective',
			items : [
				{
					text : 'Twitter',
					icon : faX,
					desc : 'Follow us on Twitter!',
					link : 'https://twitter.com/pigeonposse',
				},
				{
					text : 'GitHub',
					icon : faGithub,
					desc : 'Star us on GitHub!',
					link : 'https://github.com/pigeonposse/super8',
				},
				{
					text : 'Medium',
					icon : faMedium,
					desc : 'Read us on Medium!',
					link : 'https://medium.com/@pigeonposse',
				},
			],
		},
	],
	server : { hotReloadFiles: [ fileURLToPath( import.meta.url ) ] },
} ) )
