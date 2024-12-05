<script setup>
import {
	fontAwesomeBrandsIcons,
	fontAwesomeSolidIcons,
} from '@dovenv/core/utils/client'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useData }         from 'vitepress'

const {
	faFacebookF,
	faTelegram,
	faReddit,
	faLinkedin,
	faPinterest,
	faSkype,
	faWhatsapp,
	faGetPocket,
	faVk,
	faOdnoklassniki,
	faTumblr,
	faHackerNews,
	faXing,
	faEvernote,

} = fontAwesomeBrandsIcons
const {
	faX,
	faAt,
	faPrint,
	faEllipsisH,
} = fontAwesomeSolidIcons
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
				<FontAwesomeIcon :icon="faFacebookF" />
				<span>Facebook</span>
			</a>
			<a
				class="btn-twitter"
				data-id="tw"
			>
				<FontAwesomeIcon :icon="faX" />
				<span>Twitter</span>
			</a>
			<a
				class="btn-telegram"
				data-id="tg"
			>
				<FontAwesomeIcon :icon="faTelegram" /><span>Telegram</span>
			</a>
			<a
				class="btn-reddit"
				data-id="re"
			>
				<FontAwesomeIcon :icon="faReddit" /><span>Reddit</span>
			</a>
			<a
				class="btn-linkedin"
				data-id="in"
			>
				<FontAwesomeIcon :icon="faLinkedin" /> <span>LinkedIn</span>
			</a>
			<a
				class="btn-pinterest"
				data-id="pi"
			>
				<FontAwesomeIcon :icon="faPinterest" /> <span>Pinterest</span>
			</a>
			<a
				class="btn-skype"
				data-id="sk"
			>
				<FontAwesomeIcon :icon="faSkype" /> <span>Skype</span>
			</a>
			<a
				class="btn-whatsapp"
				data-id="wa"
			>
				<FontAwesomeIcon :icon="faWhatsapp" /> <span>WhatsApp</span>
			</a>
			<a
				class="btn-evernote"
				data-id="ev"
			>
				<FontAwesomeIcon :icon="faEvernote" /> <span>Evernote</span>
			</a>
			<a
				class="btn-pocket"
				data-id="pk"
			>
				<FontAwesomeIcon :icon="faGetPocket" />  <span>Pocket</span>
			</a>
			<a
				class="btn-vk"
				data-id="vk"
			>
				<FontAwesomeIcon :icon="faVk" /> <span>VK</span>
			</a>
			<a
				class="btn-ok"
				data-id="ok"
			>
				<FontAwesomeIcon :icon="faOdnoklassniki" /> <span>Odnoklassniki</span>
			</a>
			<a
				class="btn-tumblr"
				data-id="tu"
			>
				<FontAwesomeIcon :icon="faTumblr" /> <span>Tumblr</span>
			</a>
			<a
				class="btn-hn"
				data-id="hn"
			>
				<FontAwesomeIcon :icon="faHackerNews" /><span>Hacker News</span>
			</a>
			<a
				class="btn-xing"
				data-id="xi"
			>
				<FontAwesomeIcon :icon="faXing" />
				<span>Xing</span>
			</a>
			<a
				class="btn-mail"
				data-id="mail"
			>
				<FontAwesomeIcon :icon="faAt" />
				<span>Email</span>
			</a>
			<a
				class="btn-print"
				data-id="print"
			>
				<FontAwesomeIcon :icon="faPrint" />
				<span>Print</span>
			</a>
			<a
				class="btn-share"
				data-id="share"
			>
				<FontAwesomeIcon :icon="faEllipsisH" /> <span>Share</span>
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
	padding: 1px 10px;
	font-size: 11px;
}
.share-btn > a > span {
	display: none;
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
