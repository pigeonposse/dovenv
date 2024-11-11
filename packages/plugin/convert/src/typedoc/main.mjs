/**
 * Readme.
 * @description Readme.
 */

import {
	execProcess,
	exec,
	paths,
	joinPath,
	readJSON,
} from '@dovenv/utils'

import {
	ENV_KEY,
	utils,
} from './consts.mjs'
import { generateIndex } from './generate-index.mjs'

await execProcess( {
	name : 'UTILS DOCS',
	on   : async ( ) => {

		const typedoc   = joinPath( paths.devDir, 'typedoc', 'typedoc.config.mjs' )
		const indexPath = joinPath( paths.documentationDir, 'guide', 'utils', 'index.md' )
		const getProps  = name => ( {
			dir      : joinPath( paths.utilsDir, name ),
			input    : joinPath( paths.utilsDir, name, 'src', 'main.ts' ),
			tsconfig : joinPath( paths.utilsDir, name, 'tsconfig.json' ),
			pkg      : joinPath( paths.utilsDir, name, 'package.json' ),
			output   : joinPath( paths.documentationDir, 'guide', 'utils', name ),
		} )

		const modules = []
		for ( const mod of utils ) {

			const c   = getProps( mod.id )
			const pkg = await readJSON( c.pkg )

			modules.push( {
				...mod,
				title : pkg.extra.emoji + ' ' + pkg.extra.productName,
				desc  : pkg.description,
			} )

			const customEnv = `${ENV_KEY.PROJECT_DIR}=${c.dir} ${ENV_KEY.PROJECT_ID}=${mod.id}`
			await exec( `${customEnv} typedoc ${c.input} --out ${c.output} --tsconfig ${c.tsconfig} --options ${typedoc} --entryFileName index` )

		}

		await generateIndex( {
			modules,
			indexPath,
		} )

	},
} )
