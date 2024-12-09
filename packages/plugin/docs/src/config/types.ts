/* eslint-disable @stylistic/object-curly-newline */
import type { DeepNonNullable } from '@dovenv/core/utils'
import type { VitePWAOptions }  from 'vite-plugin-pwa'
import type {
	DefaultTheme,
	UserConfig,
} from 'vitepress'
import type { RSSOptions } from 'vitepress-plugin-rss'

type Theme = DefaultTheme.Config
type SocialLink = DefaultTheme.SocialLinkIcon
type Sidebar = Theme['sidebar']
type Nav = Theme['nav']
type SocialLinks = Theme['socialLinks']

type Link = {
	text : string
	desc : string
	/**
	 * Icons IDs: https://simpleicons.org/
	 */
	icon : SocialLink
	link : string
}
type Links = ( Link | {
	text  : string
	desc  : string
	// icon  : IconDefinition
	items : Link[]
} )[]
type Colors = {
	text?      : string
	text2?     : string
	text3?     : string
	bg?        : string
	bgAlt?     : string
	bgSoft?    : string
	bgOpacity? : string
	shadow?    : string
	divider?   : string
}
export type GetConfig = {
	config : DocsConfig
	path   : string
	dir    : string
}
export type DocsData = {
	root           : string
	devMode        : boolean
	srcDir         : string
	outDir         : string
	tempDir        : string
	cacheDir       : string
	defaultConfig  : RequiredDocsConfig
	fnConfig?      : GetConfig
	pathConfig?    : GetConfig
	packageConfig? : GetConfig
}

export type RequiredDocsConfig = DocsConfig &   DeepNonNullable<
	Pick<
		DocsConfig,
	'input' | 'output' | 'docsPath' | 'logo' | 'favicon' | 'name' | 'desc' | 'styles' | 'lang'
	>
> & { license: { type: string } }

export type DocsConfig = {
	/** Input directory for documentation files. */
	input?      : string
	/** Output directory for the built documentation. */
	output?     : string
	/** Logo URL for the documentation site. */
	logo?       : string
	/** Favicon URL for the documentation site. */
	favicon?    : string
	/** Name of the project or documentation. */
	name?       : string
	/** Short description of the project or documentation. */
	desc?       : string
	/** A shorter version of the description for better display. */
	shortDesc?  : string
	/** URL of the project or documentation site. */
	url?        : string
	/** Repository URL for the project. */
	repoURL?    : string
	/** URL for the project's issue tracker or bug reports. */
	bugsURL?    : string
	/** URL for funding or sponsorship of the project. */
	fundingURL? : string
	/** Additional URL for more resources or links related to the project. */
	moreURL?    : string
	/** NPM package URL for the project. */
	npmURL?     : string
	/** Language code for the documentation, e.g., 'en' for English. */
	lang?       : string
	/** Path to the documentation files. Used for editLink in pages */
	docsPath?   : string
	/** License information for the project. */
	license?: {
		/** Type of license (e.g., MIT, GPL). */
		type? : string
		/** URL to the full license text. */
		url?  : string
	}
	/** Version of the project. */
	version?     : string
	/** Array of previous versions of the project, each with a name and a URL. */
	oldVersions?: {
		/** The name or label of the old version, e.g., "v1.0", "Legacy". */
		name : string
		/** URL where the old version documentation */
		url  : string
	}[]
	/** CHANGELOG url of the project. */
	changelogURL?    : string
	/** contributing url of the project. */
	contributingURL? : string
	/** Custom styles for the documentation site. */
	styles?: {
		/** Color scheme for the documentation site. */
		color?: {
			/** Primary color for the theme. */
			primary?   : string
			/** Secondary color for the theme. */
			secondary? : string
			/** Tertiary color for the theme. */
			terciary?  : string
			/** Fourth color for the theme. */
			fourth?    : string
			/** Dark mode colors for the theme. */
			dark?      : Colors
			/** Light mode colors for the theme. */
			light?     : Colors
		}
		/** Border radius for elements in the theme. */
		radius? : string
	}
	/** Open Graph meta tags for better link previews on social media. */
	og?: {
		/** Description for the Open Graph metadata. */
		description?    : string
		/** Image URL for the Open Graph metadata. */
		image?          : string
		/** Title for the Open Graph metadata. */
		title?          : string
		/** URL for the site, used in Open Graph metadata. */
		url?            : string
		/** Site name for Open Graph metadata. */
		siteName?       : string
		/** Twitter account associated with the site. */
		twitterAccount? : string
	}
	/** Configuration options for RSS feed. */
	rss?    : RSSOptions
	/** Configuration options for PWA (Progressive Web App) support. */
	pwa?    : Partial<VitePWAOptions> | false
	/** Custom CSS for the documentation site. */
	css?    : string
	/** Footer configuration with links and copyright information. */
	footer?: {
		/** Links to various social platforms or contact methods. */
		links?: {
			/** Website link for the project or organization. */
			web?       : string
			/** Email link for contacting the project or organization. */
			email?     : string
			/** Twitter link for the project or organization. */
			twitter?   : string
			/** Instagram link for the project or organization. */
			instagram? : string
			/** Medium link for articles or blogs related to the project. */
			medium?    : string
		}
		/** Copyright information for the project. */
		copy?: {
			/** Name to display in copyright notices. */
			name? : string
			/** URL for the copyright holder or organization. */
			url?  : string
		}
	}
	/** Sidebar configuration for navigation within the documentation. */
	sidebar?     : Sidebar
	/** Active or desactivated sidebar autogenerated */
	autoSidebar? : {
		/**
		 * Display the "Get started" section in the sidebar.
		 * @default true
		 */
		intro?      : boolean
		/**
		 * Display the "Reference" section in the sidebar.
		 * @default true
		 */
		reference?  : boolean
		/**
		 * Display the "Contribute" section in the sidebar.
		 * @default true
		 */
		contribute? : boolean
		/**
		 * Display the "About" section in the sidebar.
		 * @default true
		 */
		about?      : boolean
	}
	/** Navigation configuration for links at the top of the documentation. */
	nav?      : Nav
	/**
	 * Additional navigation links.
	 * Icons IDs: https://simpleicons.org/
	 */
	navLinks? : SocialLinks
	/** Server-related configurations, including file watching settings. */
	server?: {
		/** Files that trigger a hot reload on changes. */
		hotReloadFiles? : string[]
		/** Files that trigger a server restart on changes. */
		restartFiles?   : string[]
	}
	/** Contributors information including their details and social links. */
	contributors?: {
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
		/**
		 * Social links for the member (e.g., GitHub, Twitter).
		 * Icons IDs: https://simpleicons.org/
		 */
		links?      : SocialLinks
		/** URL for the sponsor page for the member. */
		sponsor?    : string
		/** Text for the sponsor link. Defaults to 'Sponsor'. */
		actionText? : string
	}[]
	/** Additional links to display in a special page. */
	links?    : Links
	/** Data related to downloads and version releases. */
	download?  : {
		/**
		 * Optional grouping of download items by category.
		 * Each key in the object represents a group name and maps to a string label.
		 * @example
		 * {
		 *   "extension": "extension",
		 *   "app": "app",
		 * }
		 */
		groups? : { [key: string]: string }
		/**
		 * Optional list of downloadable items, where each key represents an item identifier.
		 * Each item includes details such as name, URL, and optionally a logo and type.
		 */
		items?: { [key: string]: {
			/** Name of the downloadable item */
			name  : string
			/** URL to access the downloadable item */
			url   : string
			/** Optional URL for the logo or icon associated with the item */
			logo? : string
			/** Optional type/category of the item, e.g., "pdf", "image" */
			type? : string
		} }
	}
	/** VitePress user configuration for additional options. */
	vitepress?    : UserConfig
	/**
	 * Settings for experimental options.
	 *
	 * **Use at your own risk**
	 */
	experimental? : {
		/**
		 * Disable temp directory during compilation.
		 * The temp directory is used to store documentation files in the output directory during the compilation process.
		 * Used to allow input paths with '../'
		 * @default false
		 */
		noTempDirOnBuild? : boolean
	}
}
