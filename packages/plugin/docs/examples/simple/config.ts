import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
	relativePath,
} from '@dovenv/core/utils'

import { docsPlugin } from '../../src/main'

const currDir = joinPath( getCurrentDir( import.meta.url ) )
const pkgDir  = joinPath( currDir, '..', '..' )

export default defineConfig( docsPlugin( {
	input  : relativePath( process.cwd(), joinPath( currDir, 'docs' ) ),
	output : relativePath( process.cwd(), joinPath( pkgDir, 'build', 'simple' ) ),
	name   : 'simple-example',
} ) )
