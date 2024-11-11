import { defineConfig } from '../packages/core/dist/main.mjs'
import { config }       from '../packages/themes/banda/dist/main.mjs'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
} from '../packages/utils/dist/main.mjs'

const currDir      = getCurrentDir( import.meta.url )
const workspaceDir = joinPath( currDir, '..' )
const pkg          = await getObjectFromJSONFile( joinPath( workspaceDir, 'package.json' ) )

export default defineConfig( [
	{
		const : {
			pkg : pkg,
			workspaceDir,
		},
		name : 'DOVENV WORKSPACE',
		desc : 'ToolKit for dovenv repository that uses the "dovenv" core and "banda" template.',
	},
	config( { docs : {
		in           : './docs',
		out          : './build',
		name         : 'dovenv',
		desc         : 'Quickly and easily set up your environment for your code projects.',
		changelogURL : 'https://github.com/pigeonposse/dovenv/blob/main/packages/core/CHANGELOG.md',
		npmURL       : 'https://www.npmjs.com/package/dovenv',
	} },
	),
] )
