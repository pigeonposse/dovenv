/**
 * VITE CONFIG
 */

import ViteRestart             from 'vite-plugin-restart'
import { type UserConfig }     from 'vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import llmstxtPlugin           from 'vitepress-plugin-llmstxt'
import { RssPlugin }           from 'vitepress-plugin-rss'

import {
	getGlobals,
	globals,
	name,
} from '../_shared/const'
import { setNav }     from './nav/main'
import { setSidebar } from './sidebar/main'

import type { ConfigResponse } from '../config/types'

export const vite = ( {
	config: conf, data,
}: ConfigResponse ):  UserConfig['vite'] => {

	return {
		optimizeDeps : { exclude: [ 'virtual:group-icons.css'  ] },
		server       : { fs: { strict: false } },
		// this can be remove for fix build icon and twoslash comments
		// build        : { rollupOptions: { external: [ 'vue/server-renderer', 'vue' ] } },
		plugins      : [
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
					if ( data.fnConfig?.path       && !configDeps.includes( data.fnConfig?.path ) ) configDeps.push( data.fnConfig?.path )

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
					console.log(  )

				},

			},

			...(  conf.groupIcon === false ?  [] : [ groupIconVitePlugin( conf.groupIcon ) ]  ),
			...(  conf.rss ? [ RssPlugin( conf.rss ) ] : [] ),
			ViteRestart( {
				reload  : [ ...( conf?.server?.hotReloadFiles ? conf.server.hotReloadFiles : [] ) ],
				restart : [ ...( conf?.server?.restartFiles ? conf.server.restartFiles : [] ) ],
			} ),
			...(  conf.llms === false ?  [] : [ llmstxtPlugin( conf.llms ) ] ),
		],
	}

}
