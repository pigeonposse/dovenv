import { defineConfig } from '../packages/core/dist/main.mjs'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
	asciiFont,
} from '../packages/utils/dist/main.mjs'

const currDir      = getCurrentDir( import.meta.url )
const workspaceDir = joinPath( currDir, '..' )
const pkg          = await getObjectFromJSONFile( joinPath( workspaceDir, 'package.json' ) )

export const coreConfig = defineConfig( { const : {
	pkg  : pkg,
	workspaceDir,
	mark : `\n${asciiFont( `pigeonposse\n-------\n${pkg.extra.id}`, 'ANSI Shadow' )}\n`,
} } )
