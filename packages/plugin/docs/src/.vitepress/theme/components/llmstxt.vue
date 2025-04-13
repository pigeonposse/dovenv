<script setup>

import { useRoute } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()

const joinUrl = ( ...parts ) => {

	return parts
		.map( ( part, index ) => {

			return index === 0 ? part.replace( /\/+$/g, '' ) : part.replace( /^\/+|\/+$/g, '' )

		} )
		.join( '/' )

}

const llmsUrl = computed( () => {

	const path = ( route.path === '/' ? '/index' : route.path.endsWith( '/' ) ? route.path.slice( 0, -1 ) : route.path ) + '.md'
	return joinUrl( path )

} )
</script>

<template>
	<div class="llmstxt-section">
		<p class="outline-title">
			LLM Resources
		</p>
		<ul>
			<li>
				<a
					:href="llmsUrl"
					target="_blank"
					class="VPLink link"
				>
					llms.txt
				</a>
			</li>
		</ul>
	</div>
</template>

<style>
.llmstxt-section {
  margin: 25px 0px 5px 0px;
}
.llmstxt-section li {
  margin: 5px;
}
.llmstxt-section a {
  font-size: small;
  margin: 0;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}
.llmstxt-section a:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}
</style>
