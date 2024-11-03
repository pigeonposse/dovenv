
import type { DownloadData }   from '../nav/get-releases'
import type { IconDefinition } from '@dovenv/utils'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import type {
	DefaultTheme,
	UserConfig,
} from 'vitepress'
import type { RSSOptions } from 'vitepress-plugin-rss'

type Theme = DefaultTheme.Config
type Sidebar = Theme['sidebar']
type Nav = Theme['nav']
type SocialLinks = Theme['socialLinks']
type Link = {
	text : string
	desc : string
	icon : IconDefinition
	link : string
}
type Links = ( Link | {
	text  : string
	desc  : string
	// icon  : IconDefinition
	items : Link[]
} )[]
type Colors = {
	text      : string
	text2     : string
	text3     : string
	bg        : string
	bgAlt     : string
	bgSoft    : string
	bgOpacity : string
	shadow    : string
	divider   : string
}
export type DocsConfig = {
	/** Input directory for documentation files. */
	in         : string
	/** Output directory for the built documentation. */
	out        : string
	/** Logo URL for the documentation site. */
	logo       : string
	/** Favicon URL for the documentation site. */
	favicon    : string
	/** Name of the project or documentation. */
	name       : string
	/** Short description of the project or documentation. */
	desc       : string
	/** A shorter version of the description for better display. */
	shortDesc  : string
	/** URL of the project or documentation site. */
	url        : string
	/** Repository URL for the project. */
	repoUrl    : string
	/** URL for the project's issue tracker or bug reports. */
	bugsUrl    : string
	/** URL for funding or sponsorship of the project. */
	fundingUrl : string
	/** Additional URL for more resources or links related to the project. */
	moreUrl    : string
	/** NPM package URL for the project. */
	npmUrl     : string
	/** Language code for the documentation, e.g., 'en' for English. */
	lang       : string
	/** Path to the documentation files. */
	docsPath   : string
	/** License information for the project. */
	license: {
		/** Type of license (e.g., MIT, GPL). */
		type : string
		/** URL to the full license text. */
		url  : string
	}
	/** Version of the project. */
	version     : string
	/** Array of previous versions of the project, each with a name and a URL. */
	oldVersions: {
		/** The name or label of the old version, e.g., "v1.0", "Legacy". */
		name : string
		/** URL where the old version documentation */
		url  : string
	}[]
	/** CHANGELOG url of the project. */
	changelogUrl    : string
	/** contributing url of the project. */
	contributingUrl : string
	/** Custom styles for the documentation site. */
	styles: {
		/** Color scheme for the documentation site. */
		color: {
			/** Primary color for the theme. */
			primary   : string
			/** Secondary color for the theme. */
			secondary : string
			/** Tertiary color for the theme. */
			terciary  : string
			/** Fourth color for the theme. */
			fourth    : string
			/** Dark mode colors for the theme. */
			dark      : Colors
			/** Light mode colors for the theme. */
			light     : Colors
		}
		/** Border radius for elements in the theme. */
		radius : string
	}
	/** Open Graph meta tags for better link previews on social media. */
	og: {
		/** Description for the Open Graph metadata. */
		description    : string
		/** Image URL for the Open Graph metadata. */
		image          : string
		/** Title for the Open Graph metadata. */
		title          : string
		/** URL for the site, used in Open Graph metadata. */
		url            : string
		/** Site name for Open Graph metadata. */
		siteName       : string
		/** Twitter account associated with the site. */
		twitterAccount : string
	}
	/** Configuration options for RSS feed. */
	rss    : RSSOptions
	/** Configuration options for PWA (Progressive Web App) support. */
	pwa    : Partial<VitePWAOptions>
	/** Custom CSS for the documentation site. */
	css    : string
	/** Footer configuration with links and copyright information. */
	footer: {
		/** Links to various social platforms or contact methods. */
		links: {
			/** Website link for the project or organization. */
			web       : string
			/** Email link for contacting the project or organization. */
			email     : string
			/** Twitter link for the project or organization. */
			twitter   : string
			/** Instagram link for the project or organization. */
			instagram : string
			/** Medium link for articles or blogs related to the project. */
			medium    : string
		}
		/** Copyright information for the project. */
		copy: {
			/** Name to display in copyright notices. */
			name : string
			/** URL for the copyright holder or organization. */
			url  : string
		}
	}
	/** Sidebar configuration for navigation within the documentation. */
	sidebar : Sidebar
	/** Navigation configuration for links at the top of the documentation. */
	nav     : Nav
	/** Server-related configurations, including file watching settings. */
	server: {
		/** Files that trigger a hot reload on changes. */
		hotReloadFiles : string[]
		/** Files that trigger a server restart on changes. */
		restartFiles   : string[]
	}
	/** Contributors information including their details and social links. */
	contributors: {
		/** Avatar image for the member. */
		avatar      : string
		/** Name of the member. */
		name        : string
		/** Title to be shown below member's name (e.g., Developer). */
		title?      : string
		/** Organization that the member belongs to. */
		org?        : string
		/** URL for the organization. */
		orgLink?    : string
		/** Description for the member. */
		desc?       : string
		/** Social links for the member (e.g., GitHub, Twitter). */
		links?      : SocialLinks
		/** URL for the sponsor page for the member. */
		sponsor?    : string
		/** Text for the sponsor link. Defaults to 'Sponsor'. */
		actionText? : string
	}[]
	/** Additional links to display in a special page. */
	links     : Links
	/** Data related to downloads and version releases. */
	download  : DownloadData
	/** VitePress user configuration for additional options. */
	vitepress : UserConfig
}
