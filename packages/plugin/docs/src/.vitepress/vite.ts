// import {
// 	copyDir,
// 	removePathIfExist,
// } from '@dovenv/core/utils'
import { VitePWA }             from 'vite-plugin-pwa'
import ViteRestart             from 'vite-plugin-restart'
import { type UserConfig }     from 'vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { RssPlugin }           from 'vitepress-plugin-rss'

import {
	getGlobals,
	globals,
	name,
} from '../_shared/const'
import { setNav }     from './nav/main'
import { setSidebar } from './sidebar/main'

import type {
	DocsData,
	RequiredDocsConfig,
} from '../config/types'

export const vite: ( conf: RequiredDocsConfig, data: DocsData ) => UserConfig['vite'] = ( conf, data ) => {

	// const confRelative = relativePath( opts.srcDir, opts.configPath )

	return {
		server  : { fs: { strict: false } },
		plugins : [
			// {
			// 	name       : name + '--post-pre-build', // the name of your custom plugin. Could be anything.
			// 	buildStart : async () => {

			// 		if ( !data.devMode ) await copyDir( {
			// 			input  : conf.in,
			// 			output : data.tempDir,
			// 		}  )
			// 		// throw new Error( 'stop' )

			// 	},
			// 	buildEnd : async () => {

			// 		// if ( !data.devMode ) await removePathIfExist( data.tempDir )

			// 	},
			// },
			{
				name : name + '--listen-to-server',
				configureServer( server ) {

					const fsWatcher = server.watcher.add( '*.md' )
					fsWatcher.on( 'all', async ( event, _path ) => {

						if ( event !== 'change' ) {

							try {

								//await server.restart()
								// server.config.logger.info( 'update sidebar...' )

							}
							catch {

								// server.config.logger.error( `${event} ${path}` )
								server.config.logger.error( 'update sidebar failed', { timestamp: true } )

							}

						}

					} )

				},

				config( config ) {

					// @ts-ignore: 	config.vitepress is not typed
					const configDeps = config.vitepress.configDeps

					if ( data.packageConfig?.path  && !configDeps.includes( data.packageConfig?.path ) ) configDeps.push( data.packageConfig?.path )
					if ( data.pathConfig?.path     && !configDeps.includes( data.pathConfig?.path ) ) configDeps.push( data.pathConfig?.path )
					if ( data.fnConfig?.path        && !configDeps.includes( data.fnConfig?.path ) ) configDeps.push( data.fnConfig?.path )
					console.debug( { configDeps } )
					const pages = getGlobals( globals.VITEPRESS_CONFIG )?.pages
					const conf  = getGlobals( globals.DOVENV_DOCS_CONFIG )
					if ( !conf ) {

						console.warn( 'Unexpected error: No config provided. Please restart the server and report this issue if persists.' )
						return

					}
					console.debug( { docsPages: pages } )
					const guide = pages?.filter( p => p.startsWith( 'guide/' ) )

					const posts        = pages?.filter( p => p.startsWith( 'posts/' ) )
					const todo         = pages?.filter( p => p.startsWith( 'todo/' ) )
					const postArchive  = pages?.some( p => p.startsWith( 'posts.md' ) )
					const contributors = pages?.some( p => p.startsWith( 'contributors.md' ) )
						? 'contributors.md'
						: undefined
					const links        = pages?.some( p => p.startsWith( 'links.md' ) )
						? 'links.md'
						: undefined

					// @ts-ignore: 	config.vitepress is not typed
					config.vitepress.site.themeConfig.sidebar = setSidebar( {
						conf,
						guide,
						contributors,
						todo,
						links,
					} )

					// @ts-ignore: 	config.vitepress is not typed
					config.vitepress.site.themeConfig.nav = setNav( {
						conf,
						guide : guide && guide.length > 0 ? true : false,
						posts : posts && posts.length > 0 && postArchive ? true : false,
						links : links ? true : false,
					} )

					// @ts-ignore: 	config.vitepress is not typed
					config.vitepress.logger.info( 'Sidebar data updated successfully', { timestamp: true } )

				},

			},
			groupIconVitePlugin(),
			...(  conf.rss ? [ RssPlugin( conf.rss ) ] : [] ),
			...( conf.pwa === false ? [] : [ VitePWA( conf.pwa ) ] ),
			ViteRestart( {
				reload  : [ ...( conf?.server?.hotReloadFiles ? conf.server.hotReloadFiles : [] ) ],
				restart : [ ...( conf?.server?.restartFiles ? conf.server.restartFiles : [] ) ],
			} ),
		],
	}

}
