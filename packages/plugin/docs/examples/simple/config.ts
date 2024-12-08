import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import { docsPlugin } from '../../src/main'

const currDir = joinPath( getCurrentDir( import.meta.url ) )
const pkgDir  = joinPath( currDir, '..', '..' )
export default defineConfig(
	docsPlugin( {
		in   : joinPath( currDir, 'docs' ),
		out  : joinPath( pkgDir, 'build', 'simple' ),
		name : 'simple-example',

	} ) )
