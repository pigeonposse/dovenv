import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import {
	Typescript2Markdown,
	Typescript2Html,
} from './main'

const pkgDir          = joinPath( getCurrentDir( import.meta.url ), '..', '..' )
const utilsLibDir     = joinPath( pkgDir, '..', '..', 'utils' )
const input           = joinPath( utilsLibDir, 'src', 'main.ts' )
const tsconfigPath    = joinPath( utilsLibDir, 'tsconfig.json' )
const packageJsonPath = joinPath( utilsLibDir, 'package.json' )
const output          = joinPath( pkgDir, 'build', 'example-src' )

const ts2md = new Typescript2Markdown( {
	input,
	output : joinPath( output, 'ts2md' ),
	opts   : {
		tsconfigPath,
		packageJsonPath,
	},
} )
await ts2md.run()

const ts2html = new Typescript2Html( {
	input,
	output : joinPath( output, 'ts2html' ),
	opts   : {
		tsconfigPath,
		packageJsonPath,
	},
} )
await ts2html.run()
