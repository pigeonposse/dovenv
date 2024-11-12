import { defineConfig }         from '../packages/core/dist/main.mjs'
import { config as aiPlugin }   from '../packages/plugin/ai/dist/main.mjs'
import { config as bandaTheme } from '../packages/themes/banda/dist/main.mjs'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
	open,
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
		name   : 'DOVENV WORKSPACE',
		desc   : 'ToolKit for dovenv repository that uses the "dovenv" core and "banda" theme.',
		custom : { donate : {
			desc : 'Donate to pigeonposse.',
			fn   : async () => {

				const res = await open( 'https://opencollective.com/pigeonposse' )
				console.log( res )

			},
		} },
	},
	bandaTheme( {
		docs : {
			in           : './docs',
			out          : './build',
			name         : 'dovenv',
			desc         : 'Quickly and easily set up your environment for your code projects.',
			changelogURL : 'https://github.com/pigeonposse/dovenv/blob/main/packages/core/CHANGELOG.md',
			npmURL       : 'https://www.npmjs.com/package/dovenv',
		},
		media : { codeimage : {
			'main-1' : { input: '/Users/angelo/dovenv/packages/plugin/media/src/qr.ts' },
			'main-2' : { input: '/Users/angelo/dovenv/packages/plugin/media/build.config.js' },
		} },
	},
	),
	aiPlugin( { chat : { space : {
		theme  : 'custom',
		input  : [ 'https://raw.githubusercontent.com/pigeonposse/.github/refs/heads/main/profile/README.md', 'https://api.github.com/orgs/pigeonposse/repos' ],
		system : `You are an expert on the PigeonPosse developer collective.

	Make sure to share accurate and relevant information about PigeonPosse, including details about their projects, mission, and examples of repositories.

Remember to focus on the PigeonPosse software collective and not confuse it with other groups or collectives. Use the information provided to provide correct and useful answers to developers.
Include relevant bits of context from files when you respond to enrich your answers. If the user mentions your project or a file in the context, respond briefly and accurately as needed and try to provide the paths (file_path) to the files to reference.
`,
	} } } ),
] )
