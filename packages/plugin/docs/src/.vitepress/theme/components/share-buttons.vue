<script setup>

// @see https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/components/VPSocialLinks.vue

import { useData }      from 'vitepress'
import { VPSocialLink } from 'vitepress/theme'

const FA = {
	HACKERNEWS : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM21 229.2c0 0 .1-.1 .1-.2s.1-.2 .2-.2c0 .1 0 .3-.1 .4H21zM239.2 384H207.8V281.3L128 128h37.3c41.5 77.7 48.1 95.8 54.1 112c1.6 4.3 3.1 8.5 5.2 13.6c3.2-7 5.1-11.9 7.1-17.3c5.9-15.3 12.8-33.2 53.5-108.3H320L239.2 283.1V384z"/></svg>`,
	ELIPSSIS   : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/></svg>`,
	AT         : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256l0 32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32l0 80 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/></svg>`,
	PRINT      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M128 0C92.7 0 64 28.7 64 64l0 96 64 0 0-96 226.7 0L384 93.3l0 66.7 64 0 0-66.7c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0L128 0zM384 352l0 32 0 64-256 0 0-64 0-16 0-16 256 0zm64 32l32 0c17.7 0 32-14.3 32-32l0-96c0-35.3-28.7-64-64-64L64 192c-35.3 0-64 28.7-64 64l0 96c0 17.7 14.3 32 32 32l32 0 0 64c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-64zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>`,
}
const {
	page, frontmatter,
} = useData()
</script>

<template>
	<div
		class="share-buttons-section"
		:class="type"
	>
		<p class="outline-title">
			Share
		</p>

		<div
			class="share-btn"
			:data-title="page.title"
			:data-desc="frontmatter.description"
		>
			<a
				class="btn-facebook"
				data-id="fb"
			>
				<VPSocialLink icon="facebook" />
				<span>Facebook</span>
			</a>
			<a
				class="btn-twitter"
				data-id="tw"
			>
				<VPSocialLink icon="twitter" />
				<span>Twitter</span>
			</a>
			<a
				class="btn-telegram"
				data-id="tg"
			>
				<VPSocialLink icon="telegram" />
				<span>Telegram</span>
			</a>
			<a
				class="btn-reddit"
				data-id="re"
			>
				<VPSocialLink icon="reddit" />
				<span>Reddit</span>
			</a>
			<a
				class="btn-linkedin"
				data-id="in"
			>
				<VPSocialLink icon="linkedin" />
				<span>LinkedIn</span>
			</a>
			<a
				class="btn-pinterest"
				data-id="pi"
			>
				<VPSocialLink icon="pinterest" />
				<span>Pinterest</span>
			</a>
			<a
				class="btn-skype"
				data-id="sk"
			>
				<VPSocialLink icon="skype" />
				<span>Skype</span>
			</a>
			<a
				class="btn-whatsapp"
				data-id="wa"
			>
				<VPSocialLink icon="whatsapp" />
				<span>WhatsApp</span>
			</a>
			<a
				class="btn-evernote"
				data-id="ev"
			>
				<VPSocialLink icon="evernote" />
				<span>Evernote</span>
			</a>
			<a
				class="btn-pocket"
				data-id="pk"
			>
				<VPSocialLink icon="pocket" />
				<span>Pocket</span>
			</a>
			<a
				class="btn-vk"
				data-id="vk"
			>
				<VPSocialLink icon="vk" />
				<span>VK</span>
			</a>
			<a
				class="btn-ok"
				data-id="ok"
			>
				<VPSocialLink icon="odnoklassniki" />
				<span>Odnoklassniki</span>
			</a>
			<a
				class="btn-tumblr"
				data-id="tu"
			>
				<VPSocialLink icon="tumblr" />
				<span>Tumblr</span>
			</a>
			<a
				class="btn-hn"
				data-id="hn"
			>
				<VPSocialLink :icon="{svg: FA.HACKERNEWS}" />
				<span>Hacker News</span>
			</a>
			<a
				class="btn-xing"
				data-id="xi"
			>
				<VPSocialLink icon="xing" />
				<span>Xing</span>
			</a>
			<a
				class="btn-mail"
				data-id="mail"
			>
				<FontAwesomeIcon :icon="{svg: FA.AT}" />
				<span>Email</span>
			</a>
			<a
				class="btn-print"
				data-id="print"
			>
				<VPSocialLink :icon="{svg: FA.PRINT}" />
				<span>Print</span>
			</a>
			<a
				class="btn-share"
				data-id="share"
			>
				<VPSocialLink :icon="{svg: FA.ELIPSSIS}" />
				<span>Share</span>
			</a>
		</div>
	</div>
</template>

<script>
const updateBtns = () => {

	const shareBtnContainer = document.querySelector( '.share-btn' )
	if ( shareBtnContainer ) {

		const currentUrl = window.location.href
		shareBtnContainer.setAttribute( 'data-url', currentUrl )
		if ( window.ShareButtons && typeof window.ShareButtons.update === 'function' ) window.ShareButtons.update()

	}

}
export default {
	props : { type : {
		type      : String,
		validator : value => [ 'page', 'sidebar' ].includes( value ),
		default   : 'page',
	} },
	mounted() {

		updateBtns()

	},
	updated : () => {

		updateBtns()

	},
}

</script>

<style>

.share-buttons-section{
	margin: 20px 0 10px 0;
	/* background-color: var(--vp-c-bg-soft); */
	border-radius: var(--pp-radius);
}
.share-buttons-section.page {
	padding: 5px 20px;
	border: 1px solid var(--vp-c-divider);
	transition: border-color 0.25s;
}
.share-buttons-section.page:hover {
	border-color: var(--pp-brand-2);
	.outline-title {
		color: var(--pp-brand-2);
	}
}
.outline-title {
	transition: color 0.25s;
	font-weight: 900;
	font-size: small;
	line-height: 1.5;
	margin: 10px 0;
}
.share-btn {
	display: flex;
	gap: 5px;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
	margin: 5px 0;
}
.share-btn > a {
	background-color: var(--vp-c-bg-alt);
	border: 1px solid var(--vp-c-divider);
	border-radius: var(--pp-radius);
	padding: 0;
	font-size: 10px;
}
.share-btn > a > span {
	display: none;
}
.share-btn > a > a  {
	width: 30px !important;
	height: 30px !important;
}

.share-btn > a > a > span,
.share-btn > a > a > svg {
	width: 13px !important;
	height: 13px !important;
}
.share-btn > a:hover {
	cursor: pointer;
	font-weight: 600;
	background-color: var(--vp-c-brand-1);
	position: relative;
	> span {
		display: flex;
		position: absolute;
		top: -30px;
		left: -50%;
		margin-inline: auto;
		width: fit-content;
		background-color: var(--vp-c-bg);
		border: 1px solid var(--vp-c-divider);
		border-radius: var(--pp-radius);
		padding: 1px 10px;
		white-space: nowrap;
		z-index: 999;
		font-size: 11px;
	}
}
</style>
