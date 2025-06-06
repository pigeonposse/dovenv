
// import Documate from '@documate/vue'
// //
// import '@documate/vue/dist/style.css'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import mediumZoom          from 'medium-zoom'
import 'virtual:group-icons.css'
import DefaultTheme        from 'vitepress/theme'
import {
	onMounted,
	h,
	Fragment,
	// render,
}    from 'vue'

// import BackToTop     from './components/back-to-top.vue'
import Contributtors from './components/contributors/layout.vue'
import Footer        from './components/footer.vue'
import LinksLayout   from './components/links/layout.vue'
import Llmstxt       from './components/llmstxt.vue'
import Posts         from './components/posts/archive.vue'
import PostAuthor    from './components/posts/author.vue'
import PostHeader    from './components/posts/header.vue'
import PostsLayout   from './components/posts/layout.vue'
import PostTopBar    from './components/posts/top-bar.vue'
import ShareButtons  from './components/share-buttons.vue'
import './custom.css'

/** @type {import('vitepress').Theme} */
export default {
	extends : DefaultTheme,

	setup() {

		onMounted( () => {

			const script = document.createElement( 'script' )
			script.src   = 'https://cdn.jsdelivr.net/npm/share-buttons/dist/share-buttons.js'
			script.async = true
			document.head.appendChild( script )

			mediumZoom( '[data-zoomable]', { background: 'var(--vp-c-bg)' } )

		} )

	},
	Layout( ) {

		return h( DefaultTheme.Layout, null, {
			'aside-outline-before' : () => h( PostAuthor ),
			'aside-outline-after'  : () => h( Fragment, [ h( Llmstxt ), h( ShareButtons, { type: 'sidebar' } ) ] ),
			// 'aside-outline-after'  : () => h( Llmstxt ),
			'doc-before'           : () => h( PostHeader ),
			'doc-after'            : () => h( ShareButtons ),
			'layout-top'           : () => h( PostTopBar ),
			'layout-bottom'        : () => h( Footer ),
			// 'nav-bar-content-before' : () => h( Documate, { endpoint: 'https://api.github.com/graphql' } ),
		} )

	},
	async enhanceApp( { app } ) {

		app.component( 'ShareButtons', ShareButtons )
		app.component( 'Posts', Posts )
		app.component( 'posts', PostsLayout )
		app.component( 'links', LinksLayout )
		app.component( 'contributors', Contributtors )
		app.use( TwoslashFloatingVue )

		// if ( typeof window === 'undefined' ) return

		// window.addEventListener( 'load', () => {

		// 	console.log( 'loaded' )
		// 	const wrapper = document.createElement( 'div' )
		// 	wrapper.id    = 'dovenv-go-to'
		// 	document.body.appendChild( wrapper )
		// 	render(
		// 		h( BackToTop, { threshold: 200 } ),
		// 		wrapper,
		// 	)

		// } )

	},
}

