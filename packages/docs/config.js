
import { defineConfig } from '@dovenv/docs'

export default defineConfig( {
	in           : '../../docs',
	out          : './build',
	name         : 'dovenv',
	desc         : 'Quickly and easily set up your environment for your code projects.',
	changelogUrl : 'https://github.com/pigeonposse/dovenv/blob/main/packages/core/CHANGELOG.md',
	npmUrl       : 'https://www.npmjs.com/package/dovenv',
} )
