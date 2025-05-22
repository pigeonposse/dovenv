import {
	getEmoji,
	getEmojiList,
} from '../emoji'

import type { EmojiObject } from '../emoji'

export const partialConstructor = ( emojis?: EmojiObject | false ) => {

	const icon    = getEmojiList( emojis )
	const getIcon = ( v: string ) => {

		const i = getEmoji( icon, v )
		if ( !i ) return ''
		return `${i} `

	}

	return {
	/**
	 * Returns the installation instructions for the library.
	 *
	 * **required const**: libPkg.
	 */
		installation : `\`\`\`bash 
npm install {{const.libPkg.name}}
# or
pnpm install {{const.libPkg.name}}
# or
yarn add {{const.libPkg.name}}
# or
bun add {{const.libPkg.name}}
# or
deno add {{const.libPkg.name}}
\`\`\``,
		/**
		 * Returns the installation instructions for the library.
		 *
		 * **required const**: libPkg.
		 */
		installationGroup : `::: code-group

\`\`\`bash [npm]
npm install {{const.libPkg.name}}
\`\`\`

\`\`\`bash [pnpm]
pnpm install {{const.libPkg.name}}
\`\`\`

\`\`\`bash [yarn]
yarn add {{const.libPkg.name}}
\`\`\`

\`\`\`bash [bun]
bun add {{const.libPkg.name}}
\`\`\`

\`\`\`bash [deno]
deno add {{const.libPkg.name}}
\`\`\`

:::`,

		/**
		 * Returns the creation instructions for the library.
		 *
		 * **required const**: libPkg.
		 */
		creationGroup : `::: code-group

\`\`\`bash [npm]
npm create {{const.libPkg.name}}
\`\`\`

\`\`\`bash [pnpm]
pnpm create {{const.libPkg.name}}
\`\`\`

\`\`\`bash [yarn]
yarn create {{const.libPkg.name}}
\`\`\`

\`\`\`bash [bun]
bun create {{const.libPkg.name}}
\`\`\`

\`\`\`bash [deno]
deno init --npm {{const.libPkg.name}}
\`\`\`

:::`,

		/**
		 * Returns the creation instructions for the library.
		 *
		 * **required const**: libPkg.
		 */
		creation : `\`\`\`bash 
npm create {{const.libPkg.name}}
# or
pnpm create {{const.libPkg.name}}
# or
yarn create {{const.libPkg.name}}
# or
bun create {{const.libPkg.name}}
# or
deno init --npm {{const.libPkg.name}}
\`\`\``,

		/**
		 * Returns the footer for the documentation.
		 *
		 * **required const**: pkg, socialBadges, mark, contributors.
		 */
		footer : `## ${getIcon( 'development' )}Development

__{{const.pkg.extra.productName}}__ is an open-source project and its development is open to anyone who wants to participate.

[![Issues](https://img.shields.io/badge/Issues-grey?style=for-the-badge)]({{const.REPO_URL}}issues)
[![Pull requests](https://img.shields.io/badge/Pulls-grey?style=for-the-badge)]({{const.REPO_URL}}pulls)
[![Read more](https://img.shields.io/badge/Read%20more-grey?style=for-the-badge)]({{const.pkg.homepage}})

## ${getIcon( 'donate' )}Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)]({{const.pkg.funding.url}})

## ${getIcon( 'license' )}License

This software is licensed with __[{{const.pkg.license}}]({{const.pkg.extra.licenseURL}})__.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)]({{const.pkg.extra.licenseURL}})

## ${getIcon( 'about' )}About us

*{{const.pkg.extra.collective.name}}* is a __code development collective__ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)]({{const.pkg.extra.collective.gh}})


{{const.contributors}}

---

{{const.socialBadges}}

<!--
{{const.mark}}
-->
`,
	}

}
