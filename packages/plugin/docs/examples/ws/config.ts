
import { defineConfig } from '@dovenv/core'
import {
	fontAwesomeSolidIcons,
	fa2svg,
} from '@dovenv/utils-media/client'

import coreConfig     from '../../../../../.dovenv/main' // Get another configuration for use
import { docsPlugin } from '../../src/main'

const {
	faBook,
	faCode,
	faDownload,
	faGlobe,
} = fontAwesomeSolidIcons

export default defineConfig(
	coreConfig,
	docsPlugin( {
		input    : '../../../docs',
		output   : './build/ws',
		name     : 'dovenvff',
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
		npmURL   : 'https://www.npmjs.com/package/dovenv',
		navLinks : [
			{
				icon : 'githubactions',
				link : 'https://github.com/pigeonposse/dovenv',
			},
		],
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
		// meta      : { autoImage: true },
		twoslash  : false,
		vitepress : {
			sitemap         : { hostname: 'https://dovenv.pigeonposse.com' },
			ignoreDeadLinks : true,
			vite            : { build: { chunkSizeWarningLimit: 1000 } },
		},
		links : [
			{
				text  : 'Project',
				desc  : 'See more information about the project',
				items : [
					{
						text : 'Website',
						icon : { svg: fa2svg( faGlobe ) as string },
						desc : 'Enjoy our application!',
						link : 'https://super8.pigeonposse.com',
					},
					{
						text : 'Docs',
						icon : { svg: fa2svg( faBook ) as string },
						desc : 'Read our documentation!',
						link : 'https://docs.super8.pigeonposse.com',
					},
					{
						text : 'Repo',
						icon : { svg: fa2svg( faCode ) as string },
						desc : 'Star us on GitHub!',
						link : 'https://github.com/pigeonposse/super8',
					},
					{
						text : 'Releases',
						icon : { svg: fa2svg( faDownload ) as string },
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
						icon : 'twitter',
						desc : 'Follow us on Twitter!',
						link : 'https://twitter.com/pigeonposse',
					},
					{
						text : 'GitHub',
						icon : 'github',
						desc : 'Star us on GitHub!',
						link : 'https://github.com/pigeonposse/super8',
					},
					{
						text : 'Medium',
						icon : 'medium',
						desc : 'Read us on Medium!',
						link : 'https://medium.com/@pigeonposse',
					},
				],
			},
		],
		autoSidebar : { contribute: false },
	} ),
)
