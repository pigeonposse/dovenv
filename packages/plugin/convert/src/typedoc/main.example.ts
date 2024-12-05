import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import { Typescript2Markdown } from './main'

const pkgDir          = joinPath( getCurrentDir( import.meta.url ), '..', '..' )
const utilsLibDir     = joinPath( pkgDir, '..', '..', 'utils' )
const input           = joinPath( utilsLibDir, 'src', 'main.ts' )
const tsconfigPath    = joinPath( utilsLibDir, 'tsconfig.json' )
const packageJsonPath = joinPath( utilsLibDir, 'package.json' )
const output          = joinPath( pkgDir, 'build', 'typedoc' )
const ts2md           = new Typescript2Markdown( {
	input  : input,
	output : output,
	opts   : {
		tsconfigPath,
		packageJsonPath,
	},
} )

await ts2md.run()
