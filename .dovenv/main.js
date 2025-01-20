import core                         from './const.js'
import { defineConfig }             from '../packages/core/dist/main.mjs'
import { pigeonposseMonorepoTheme } from '../packages/theme/pigeonposse/dist/main.mjs'

export default defineConfig(
	pigeonposseMonorepoTheme( {
		core,
		lint : { staged: { '**/*.{js,ts,jsx,tsx,json}': 'pnpm --silent . lint eslint --fix --silent' } },
	} ),
)
// "extra": {
// 	"id": "dovenv",
// 	"productName": "dovenv",
// 	"shortDesc": "Toolkit for make your code workspace easier",
// 	"action": "Complex projects should be easier",
// 	"libraryURL": "https://www.npmjs.com/package/@dovenv/core",
// 	"licenseURL": "https://github.com/pigeonposse/dovenv/blob/main/LICENSE",
// 	"changelogURL": "https://github.com/pigeonposse/dovenv/blob/main/packages/core/CHANGELOG.md",
// 	"contributingURL": "https://github.com/pigeonposse/.github/blob/main/CONTRIBUTING.md",
// 	"libraryID": "@dovenv/core",
// 	"repoID": "dovenv",
// 	"rawRepoURL": "https://raw.githubusercontent.com/pigeonposse/dovenv",
// 	"docsURL": "https://dovenv.pigeonposse.com",
// 	"type": "library",
// 	"subtype": [
// 		"bin",
// 		"cli",
// 		"env"
// 	],
// 	"collective": {
// 		"id": "pigeonposse",
// 		"name": "PigeonPosse",
// 		"funding": "https://pigeonposse.com/?popup=donate",
// 		"gh": "https://github.com/pigeonposse",
// 		"about": "https://pigeonposse.com?popup=about",
// 		"url": "https://pigeonposse.com",
// 		"web": "https://pigeonposse.com",
// 		"email": "dev@pigeonposse.com",
// 		"socialUser": {
// 			"twitter": "pigeonposse_",
// 			"instagram": "pigeon.posse",
// 			"medium": "pigeonposse"
// 		},
// 		"social": {
// 			"twitter": "https://twitter.com/pigeonposse_",
// 			"instagram": "https://www.instagram.com/pigeon.posse/",
// 			"medium": "https://medium.com/@pigeonposse"
// 		}
// 	}
// },
