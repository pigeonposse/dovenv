<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { defineProps }     from 'vue'

// eslint-disable-next-line vue/require-default-prop
const props = defineProps( { item: Object } )

</script>

<template>
	<a
		:href="props.item.link"
		class="links-link"
		target="_blank"
	>

		<span class="links-link-text">
			<span class="title">{{ props.item.text }}</span>
			<span
				v-if="props.item.desc"
				class="desc"
			>
				{{ props.item.desc }}
			</span>
		</span>
		<FontAwesomeIcon
			:icon="props.item.icon"
			size="4x"
		/>
	</a>
</template>

<style scoped>

.links-link {
    display: flex;
	width: 100%;
    align-items: center;
	position: relative;
    gap: 8px;
    padding: 20px 40px;
    border-radius: var(--pp-radius);
    border: 1px solid var(--vp-c-divider);
    align-content: center;
    justify-content: space-between;
    flex-direction: row;
    overflow: hidden;
	text-decoration: auto;
	h3{
		margin:0;
	}
}
.links-link::before{
	background-color: var(--vp-c-bg-soft);
	background-image: var(--vp-home-hero-image-background-image);
    filter: var(--vp-home-hero-image-filter);
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.36;
}
.links-link{
	display: flex;
	gap: 40px;
}
.links-link-text{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.links-link-text .title{
	font-size: x-large;
	font-weight: 900;
	opacity: 0.5;
}
.desc {
	color: var(--vp-c-text-2);
	opacity: 0.8;
}
</style>
