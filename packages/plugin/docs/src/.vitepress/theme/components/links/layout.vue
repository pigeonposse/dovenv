<script setup>
import { useData }  from 'vitepress'
import {
	VPHomeContent,
	VPTeamPageTitle,
} from 'vitepress/theme'
import {
	onMounted,
	onUnmounted,
} from 'vue'

import SingleLink from './single.vue'

const { theme } = useData()
const isGroup   = item => item.items !== undefined
onMounted( () => {

	const layoutDiv = document.querySelector( '.Layout' )
	if ( !layoutDiv ) return

	if ( !layoutDiv.classList.contains( 'dovenv-home' ) ) layoutDiv.classList.add( 'dovenv-home' )

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
		<VPTeamPageTitle>
			<template #title>
				{{ theme.siteTitle }} links
			</template>
			<template #lead>
				Reference links for the project <b>{{ theme.siteTitle }}</b>
			</template>
		</VPTeamPageTitle>
		<slot name="home-hero-after" />
		<VPHomeContent>
			<div class="links-container">
				<template
					v-for="(item, index) in theme.links"
					:key="index"
				>
					<template
						v-if="isGroup(item)"
					>
						<div class="links-group">
							<div class="links-group-header">
								<i
									:class="item.icon"
									class="group-icon"
								/>
								<h2>{{ item.text }}</h2>
							</div>

							<div
								class="links-group-items"
							>
								<template
									v-for="(subItem, subIndex) in item.items"
									:key="subIndex"
								>
									<SingleLink :item="subItem" />
								</template>
							</div>
						</div>
					</template>

					<template v-else>
						<SingleLink :item="item" />
					</template>
				</template>
			</div>
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

h2 {
	color: var(--vp-c-text-2);
	font-weight: 900;
	font-size: xx-large;
}
.links-container {
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
	text-align: center;
}
.links-group{
	width: 100%;
}
.links-group-items {
	display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
}
</style>
