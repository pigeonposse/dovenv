<script setup>
import {
	shallowRef,
	onMounted,
} from 'vue'

import ArticleCard from './card.vue'

const articles = shallowRef( [] )

onMounted( async () => {

	const { data } = await import( './posts.data.ts' )
	articles.value = data

} )
</script>

<template>
	<div class="container-posts">
		<!-- eslint-disable vue/valid-v-for -->
		<ArticleCard
			v-for="article in articles"
			v-memo="[article]"
			:title="article.title"
			:href="article.url"
			:date="article.date.string"
			:image="article.image"
			:author="article.author"
			:category="article.category"
			:excerpt="article.excerpt"
		/>
	</div>
</template>
<style scoped>
.container-posts {
	display: grid;
    grid-template-columns: repeat(1, 1fr);
    flex-direction: column;
    align-items: center;
	gap: 10px;
	max-width: calc(var(--vp-layout-max-width) - 64px);
	/* margin: auto 20px; */
}
@media (min-width: 768px) {
	.container-posts {
		grid-template-columns: repeat(2, 1fr);
		margin: auto;
	}
}
</style>
