import { defineConfig } from '../packages/core/dist/main.mjs'
import { config }       from '../packages/templates/banda/dist/main.mjs'
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
	config( { docs: { configPath: joinPath( currDir,  'docs.config.js' ) } },
	),
] )
