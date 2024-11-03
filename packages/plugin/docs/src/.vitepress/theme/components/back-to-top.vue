<template>
	<transition name="fade">
		<div
			v-if="show"
			class="go-to-top"
			@click="scrollToTop"
		>
			<svg
				class="icon-top"
				viewBox="0 0 48 48"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				stroke="currentColor"
				stroke-width="4"
				stroke-linecap="butt"
				stroke-linejoin="miter"
			>
				<path d="M39.6 30.557 24.043 15 8.487 30.557" />
			</svg>
		</div>
	</transition>
</template>

<script setup lang="ts">
import {
	computed,
	onMounted,
	ref,
} from 'vue'

const props = withDefaults(
	// eslint-disable-next-line vue/valid-define-props
	defineProps(),
	{ threshold: 300 },
)

const scrollTop = ref( 0 )
// @ts-ignore: 	config.vitepress is not typed
const show = computed( () => scrollTop.value > props.threshold )

onMounted( () => {

	scrollTop.value = getScrollTop()
	window.addEventListener(
		'scroll',
		debounce( () => {

			scrollTop.value = getScrollTop()

		}, 100 ),
	)

} )

const getScrollTop = () => {

	return (
		window.pageYOffset
		|| document.documentElement.scrollTop
		|| document.body.scrollTop
		|| 0
	)

}

const scrollToTop = () => {

	window.scrollTo( {
		top      : 0,
		behavior : 'smooth',
	} )
	scrollTop.value = 0

}

const debounce = ( func, timeout = 100 ) => {

	let timer
	return ( ...args ) => {

		clearTimeout( timer )
		timer = setTimeout( () => {

			func.apply( null, args )

		}, timeout )

	}

}
</script>

<style scoped>
.go-to-top {
	width: 36px;
	height: 36px;
	line-height: 36px;
	padding: 0;
	text-align: center;
	border-radius: 50%;
	background-color: var(--vp-c-bg-soft);
	border: 1px solid var(--vp-c-divider);
	box-shadow: 0 2px 12px var(--vp-shadow-2);
	cursor: pointer;
	position: fixed;
	bottom: 2rem;
	right: 2.5rem;
}

.go-to-top:hover {
	color: var(--vp-c-brand-1);
	border-color: var(--vp-c-brand-1);
	transition:all 0.45s;
}

.go-to-top .icon-top {
	width: 1em;
	height: 1em;
	font-size: 14px;
	display: inline-block;
}

@media (max-width: 959px) {
	.go-to-top {
	display: none;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
  </style>
