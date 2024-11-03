
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
	render,
}    from 'vue'

import BackToTop     from './components/back-to-top.vue'
import Contributtors from './components/contributors/layout.vue'
import Footer        from './components/footer.vue'
import LinksLayout   from './components/links/layout.vue'
import Posts         from './components/posts/archive.vue'
import PostAuthor    from './components/posts/author.vue'
import PostHeader    from './components/posts/header.vue'
import PostsLayout   from './components/posts/layout.vue'
import PostTopBar    from './components/posts/top-bar.vue'
import ShareButtons  from './components/share-buttons.vue'
import './custom.css'

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
	Layout() {

		return h( DefaultTheme.Layout, null, {
			'aside-outline-before' : () => h( PostAuthor ),
			'aside-outline-after'  : () => h( ShareButtons, { type: 'sidebar' } ),
			'doc-before'           : () => h( PostHeader ),
			'doc-after'            : () => h( ShareButtons ),
			'layout-top'           : () => h( PostTopBar ),
			'layout-bottom'        : () => h( Footer ),
			// 'nav-bar-content-before' : () => h( Documate, { endpoint: 'https://api.github.com/graphql' } ),
		} )

	},
	async enhanceApp( { app } ) {

		app.component( 'ShareButtons', ShareButtons )
		// eslint-disable-next-line vue/multi-word-component-names
		app.component( 'Posts', Posts )
		// eslint-disable-next-line vue/multi-word-component-names, vue/component-definition-name-casing
		app.component( 'posts', PostsLayout )
		// eslint-disable-next-line vue/multi-word-component-names, vue/component-definition-name-casing
		app.component( 'links', LinksLayout )
		// eslint-disable-next-line vue/multi-word-component-names, vue/component-definition-name-casing
		app.component( 'contributors', Contributtors )
		app.use( TwoslashFloatingVue )
		if ( typeof window === 'undefined' ) return
		window.addEventListener( 'load', () => {

			const wrapper = document.createElement( 'div' )
			document.body.appendChild( wrapper )
			render(
				h( BackToTop, { threshold: 200 } ),
				wrapper,
			)

		} )

	},
}

