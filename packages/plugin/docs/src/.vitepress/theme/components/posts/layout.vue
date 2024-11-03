<script setup>

import {
	VPHomeContent,
	VPHomeHero,
} from 'vitepress/theme'
import {
	onMounted,
	onUnmounted,
} from 'vue'

import Posts from './archive.vue'

onMounted( () => {

	const layoutDiv = document.querySelector( '.Layout' )

	if ( !layoutDiv ) return

	if ( !layoutDiv.classList.contains( 'dovenv-home' ) ) layoutDiv.classList.add( 'dovenv-home' )
	if ( !layoutDiv.classList.contains( 'articles' ) ) layoutDiv.classList.add( 'articles' )

} )
onUnmounted( () => {

	const layoutDiv = document.querySelector( '.Layout' )

	if ( !layoutDiv ) return

	if ( layoutDiv.classList.contains( 'dovenv-home' ) ) layoutDiv.classList.remove( 'dovenv-home' )
	if ( layoutDiv.classList.contains( 'articles' ) ) layoutDiv.classList.remove( 'articles' )

} )

</script>

<template>
	<div class="VPHome">
		<slot name="home-hero-before" />
		<VPHomeHero>
			<template #home-hero-info-before>
				<slot name="home-hero-info-before" />
			</template>
			<template #home-hero-info>
				<slot name="home-hero-info" />
			</template>
			<template #home-hero-info-after>
				<slot name="home-hero-info-after" />
			</template>
			<template #home-hero-actions-after>
				<slot name="home-hero-actions-after" />
			</template>
			<template #home-hero-image>
				<slot name="home-hero-image" />
			</template>
		</VPHomeHero>
		<slot name="home-hero-after" />

		<VPHomeContent>
			<Posts />
		</VPHomeContent>
	</div>
</template>

<style scoped>
.VPHome {
  margin-bottom: 96px;
}

@media (min-width: 768px) {
  .VPHome {
    margin-bottom: 128px;
  }
}
</style>
