import {
	copyDir,
	joinPath,
	removePathIfExist,
} from '@dovenv/utils'
import { VitePWA }             from 'vite-plugin-pwa'
import ViteRestart             from 'vite-plugin-restart'
import { type UserConfig }     from 'vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { RssPlugin }           from 'vitepress-plugin-rss'

import { getGlobals } from './const'
import { setNav }     from './nav/main'
import { setSidebar } from './sidebar/main'

import type { DocsConfig } from '../config/types'

export const vite: ( conf: DocsConfig, opts:{
	srcDir           : string
	docsDestTempPath : string
	devMode          : boolean
	configPath       : string
} ) => UserConfig['vite'] = ( conf, opts ) => {

	// const confRelative = relativePath( opts.srcDir, opts.configPath )

	return {
		server  : { fs: { strict: false } },
		plugins : [
			groupIconVitePlugin(),
			RssPlugin( conf.rss ),
			VitePWA( conf.pwa ),
			{
				name       : 'dovenv--post-pre-build', // the name of your custom plugin. Could be anything.
				buildStart : async () => {

					if ( !opts.devMode ) await copyDir( {
						input  : conf.in,
						output : opts.docsDestTempPath,
					}  )

				},
				buildEnd : async () => {

					if ( !opts.devMode ) await removePathIfExist( opts.docsDestTempPath )

				},
			},
			{
				name : 'dovenv--listen-to-server',
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

					const pkgPath = joinPath( opts.srcDir, 'package.json' )
					// @ts-ignore: 	config.vitepress is not typed
					if ( !config.vitepress.configDeps.includes( pkgPath ) ) config.vitepress.configDeps.push( pkgPath )
					// @ts-ignore: 	config.vitepress is not typed
					if ( !config.vitepress.configDeps.includes( opts.configPath ) )config.vitepress.configDeps.push( opts.configPath )

					const pages: string[] | undefined = 'VITEPRESS_CONFIG' in globalThis && globalThis.VITEPRESS_CONFIG.pages ? globalThis.VITEPRESS_CONFIG.pages : undefined
					const conf                        = getGlobals( 'DOVENV_DOCS_CONFIG' ).config

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
			ViteRestart( {
				reload  : [ ...( conf.server.hotReloadFiles ? conf.server.hotReloadFiles : [] ) ],
				restart : [ ...( conf.server.restartFiles ? conf.server.restartFiles : [] ) ],
			} ),
		],
	}

}
