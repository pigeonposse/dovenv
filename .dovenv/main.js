
import { customConfig } from './cmds.js'
import {
	markSchema,
	pkgSchema,
	validateSchema,
} from './schema.js'
import { defineConfig }     from '../packages/core/dist/main.mjs'
import { pigeonposseTheme } from '../packages/theme/pigeonposse/dist/main.mjs'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
	asciiFont,
} from '../packages/utils/dist/main.mjs'

const currDir      = getCurrentDir( import.meta.url )
const workspaceDir = joinPath( currDir, '..' )
const pkg          = await getObjectFromJSONFile( joinPath( workspaceDir, 'package.json' ) )

export default defineConfig(
	{
		name  : 'DOVENV WORKSPACE',
		desc  : `ToolKit for ${pkg.extra.id} repository that uses the "dovenv" core and "pigeonposse" theme.`,
		const : {
			pkg  : pkg,
			workspaceDir,
			mark : `\n${asciiFont( `${pkg.extra.collective.id}\n-------\n${pkg.extra.id}`, 'ANSI Shadow' )}\n`,
		},
		check : { const : {
			type : 'custom',
			desc : 'Check dovenv consts schemas',
			fn   : async ( { config } ) => {

				if ( !config.const.pkg ) throw 'Must exist [pkg] const in dovenv configuration'
				if ( !config.const.mark ) throw 'Must exist [mark] const in dovenv config.\nThis must be a text, for example a watermark, a trademark, or a simple text about the project.'

				await validateSchema( pkgSchema, config.const.pkg, 'pkg' )
				await validateSchema( markSchema, config.const.mark, 'mark' )

			},
		} },
	},
	customConfig,
	pigeonposseTheme( {
		docs : {
			input        : './docs',
			output       : './build',
			name         : 'dovenv',
			desc         : 'Quickly and easily set up your environment for your code projects.',
			changelogURL : 'https://github.com/pigeonposse/dovenv/blob/main/packages/core/CHANGELOG.md',
			npmURL       : 'https://www.npmjs.com/package/dovenv',
		},
		lint : { staged: { '**/*.{js,ts,jsx,tsx,json}': 'pnpm --silent . lint eslint --silent' } },
		repo : { commit : { scopes : [
			{
				value : 'core',
				desc  : 'Core package',
			},
			{
				value : 'plugin',
				desc  : 'Plugin package(s)',
			},
			{
				value : 'theme',
				desc  : 'Theme package',
			},
			{
				value : 'utils',
				desc  : 'Utils package',
			},
			{
				value : 'all',
				desc  : 'All packages',
			},
			{
				value : 'env',
				desc  : 'Only development environment',
			},
		] } },
	} ),
)
