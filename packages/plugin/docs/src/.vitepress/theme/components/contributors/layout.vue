<script setup>
import { useData } from 'vitepress'
import {
	VPTeamMembers,
	VPTeamPageTitle,
	VPTeamPage,
} from 'vitepress/theme'

const { theme } = useData()

</script>

<template>
	<div class="VPDoc">
		<VPTeamPage>
			<VPTeamPageTitle>
				<template #title>
					Our Team
				</template>
			<!-- <template #lead>
				The development of {{ theme.siteTitle }} is guided by an international
				team, some of whom have chosen to be featured below.
				</template> -->
			</VPTeamPageTitle>
			<VPTeamMembers
				:members="theme.contributors"
			/>
		</VPTeamPage>

		<slot name="page-bottom" />
	</div>
</template>

