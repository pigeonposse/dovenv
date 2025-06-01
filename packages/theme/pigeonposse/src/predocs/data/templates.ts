import {
	getEmoji,
	getEmojiList,
} from '../emoji'

import type { EmojiObject } from '../emoji'

export const templateConstructor = ( emojis?: EmojiObject | false ) => {

	const icon    = getEmojiList( emojis )
	const getIcon = ( v: string ) => {

		const i = getEmoji( icon, v )
		if ( !i ) return
		return `${i} `

	}

	return {
		/**
		 * Returns the readme template for a package.
		 *
		 * **required const**: title, pkg, socialBadges, pkgBadges, toc, banner.
		 *
		 * **required partial**: installation, toc, content.
		 */
		readmePkg : `# {{const.title}}

{{const.socialBadges}}

{{const.banner}}

{{const.pkgBadges}}
{{const.libPkgBadges}}

{{const.desc}}

{{const.toc}}

{{partial.precontent}}

## ${getIcon( 'installation' )}Installation

{{partial.installation}}

{{partial.content}}

---

{{partial.footer}}
`,

		/**
		 * Returns a index template for a `dovenv` docs page.
		 *
		 * **required const**: templateMark, docsIndex.
		 *
		 * **required partial**: installationGroup.
		 */
		docsIndex : `---
{{const.templateMark}}

{{const.docsIndex}}
---

{{partial.installationGroup}}
`,

		/**
		 * Returns a index template for a `dovenv` docs page with project creation instructions.
		 *
		 * **required const**: templateMark, docsIndex.
		 *
		 * **required partial**: installationGroup.
		 */
		docsIndexWithCreate : `---
{{const.templateMark}}

{{const.docsIndex}}
---

## Installation
{{partial.installationGroup}}

## Start a project
{{partial.creationGroup}}
`,

		/**
		 * Returns a contributors index template for a `dovenv` docs page.
		 *
		 * **required const**: templateMark.
		 */
		docsContributors : `---
{{const.templateMark}}

layout: contributors
---
`,
	}

}
