
import type { TYPE }        from './const'
import type { EmojiObject } from './emoji'
import type {
	ObjectValues,
	PackageJSON,
} from '@dovenv/core/utils'
import type { docs } from '@dovenv/theme-banda'

export type PkgType = ObjectValues<typeof TYPE>

export type PkgData = {
	/** Absosulte local dir of documentation */
	docsDir       : string
	/** Absosulte local dir of documentation assets */
	docsPublicDir : string
	/** Absosulte local dir of documentation guide */
	docsGuideDir  : string
	urlGuidePath  : string
	url           : string
	name          : string
	packagesPath  : string
	data: {
		type       : PkgType
		id         : string
		pathID     : string
		title      : string
		emojiType? : string
		emojiId?   : string
		name       : string
		data       : PackageJSON
		repoURL    : string
		package: {
			relativeDir         : string
			dir                 : string
			srcFile             : string
			packageJsonFile     : string
			tsconfigFile?       : string
			readmeFile          : string
			docsFile?           : string
			examplesConfigFile? : string
			isTs                : boolean
		}
		docs: {
			dir     : string
			urlPath: {
				api?      : string
				examples? : string
				index     : string
			}
			apiFile?      : string
			examplesFile? : string
			indexFile     : string
		}
	}[]
}

export type PredocsConfig = {
	/** Set index page options */
	index?: {
		/**
		 * Add custom content to index doc page
		 * @see https://vitepress.dev/reference/default-theme-home-page
		 */
		custom?           : Record<string, unknown>
		/** Remove default features */
		noFeatures?       : boolean
		/** Remove default action */
		noAction?         : boolean
		/** Add content after frontmatter */
		content?          : string
		/** Change template to `creation` template */
		creationTemplate? : boolean
	}
	/**
	 * Set emojis for your packages.
	 * @example
	 * {
	 *   core: '🌞',
	 *   create: false,
	 * }
	 */
	emoji?        : EmojiObject | false
	/** Guide section options */
	guideSection? : { none?: PkgType[] | string[] }
}

type Sidebar = NonNullable<docs.DocsConfig['sidebar']>
type ExtractSidebarArray<T> = T extends ( infer U )[]
	? U[]
	: T extends { [key: string]: infer V }
		? V extends ( infer U )[]
			? U[]
			: never
		: never

export type SidebarItems = ExtractSidebarArray<Sidebar>

export type SidebarConfig = {
	/** Get only sidebar reference */
	onlyReference : boolean
	/** Change, remove or add emojis to sidebar */
	emojis?       : EmojiObject | false
}
