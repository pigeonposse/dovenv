<script setup>

import { useData } from 'vitepress/client'

const formatlink = ( key, link ) => {

	return key === 'email'
		? `mailto:${link}

`
		: link

}

const { theme } = useData()

</script>

<template>
	<!--
		✗ BAD
	-->
	<footer
		v-if="theme.customFooter !== false"
		class="container"
	>
		<div
			v-if="theme.collectiveLinks"
			class="collectivelinks"
		>
			<a
				v-for="(link, key) in theme.collectiveLinks"
				:key="key"
				:href="formatLink(key, link)"
				target="_blank"
			>{{ key }}

			</a>
		</div>
		<div class="mark">
			<span>Released under the {{ theme.customFooter.license }}

				License.</span>
			<span>Copyright © {{ new Date().getFullYear() }}

				<a
					:href="theme.customFooter.copy.url"
					target="_blank"
				> {{ theme.customFooter.copy.name }}

				</a></span>
		</div>
	</footer>
</template>

<style scoped>

	footer {
		/* background-color: var(--vp-c-bg-soft); */
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: calc(var(--vp-layout-max-width) - 64px);
		padding: 40px;
		margin: auto;
		font-size: small;
		border-radius: 20px;
	}

	.mark {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: small;
		opacity: 0.5;
	}

	.collectivelinks {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
		text-transform:capitalize;
	}

	.collectivelinks a {
		padding: 5px 10px;
	}

</style>
