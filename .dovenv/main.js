import { defineConfig }     from '../packages/core/dist/main.mjs'
import { pigeonposseTheme } from '../packages/theme/pigeonposse/dist/main.mjs'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
} from '../packages/utils/dist/main.mjs'

const currDir      = getCurrentDir( import.meta.url )
const workspaceDir = joinPath( currDir, '..' )
const packagesDir  = joinPath( workspaceDir, 'packages' )
const coreDir      = joinPath( packagesDir, 'core' )

/** @type {import('../packages/utils/dist/main.mjs').PackageJSON}  */
const pkg = await getObjectFromJSONFile( joinPath( workspaceDir, 'package.json' ) )

/** @type {import('../packages/utils/dist/main.mjs').PackageJSON}  */
const corePkg = await getObjectFromJSONFile( joinPath( coreDir,  'package.json' ) )

export const CONSTS = {
	pkg,
	corePkg,
	workspaceDir,
	packagesDir,
	coreDir,
}

export default defineConfig(
	{ const: CONSTS },
	pigeonposseTheme( {
		core : {
			pkg,
			workspaceDir,
		},
		lint : { staged: { '**/*.{js,ts,jsx,tsx,json}': 'pnpm --silent . lint eslint --fix --silent' } },
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
