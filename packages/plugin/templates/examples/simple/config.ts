
import { defineConfig } from '@dovenv/core'
import {
	ensureDir,
	geMDTocString,
	getCurrentDir,
	incrementMdHeaders,
	joinPath,
	writeFile,
} from '@dovenv/core/utils'

import pkg                 from '../../../../../package.json'
import { templatesPlugin } from '../../src/main'

const currDir  = getCurrentDir( import.meta.url )
const pkgDir   = joinPath( currDir, '..', '..'  )
const wsDir    = joinPath( pkgDir, '..', '..', '..' )
const buildDir = joinPath( pkgDir, 'build', 'simple' )

export default defineConfig( [
	{ const : {
		pkg,
		wsDir,
	} },
	templatesPlugin( { test : {
		input   : `{{partial.content}}`,
		partial : {
			readme : {
				input : joinPath( wsDir, 'README.md' ),
				hook  : {
					before : async data => {

						data.content = await incrementMdHeaders( data.content )
						return data

					},
					after : async data => {

						const readmeContent = '# custom example of readme\n\n' + data.content
						await ensureDir( buildDir )
						await writeFile( joinPath( buildDir, 'test-part-readme.md' ), readmeContent )
						return data

					},
				},
			},
			withtoc : {
				input : `# {{const.pkg.name}}\n\n{{const.toc}}\n\n{{partial.readme}}`,
				hook  : { after : async data => {

					if ( !data.const ) data.const = {}

					data.const.toc = await geMDTocString( {
						input           : data.content,
						title           : 'Table of contents',
						removeH1        : true,
						maxHeadingLevel : 4,
					} )
					return data

				} },
			},
			content : { input: '{{partial.withtoc}}' },
		},
		// hook : { before : async data => ( console.log( data ), data ),
		// 	// after  : async data => ( console.log( data ), data ),
		// },
		output : joinPath( buildDir, 'test.md' ),
	} } ),
] )
