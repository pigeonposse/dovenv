
import { defineConfig } from '@dovenv/core'
import {
	asciiFont,
	geMDTocString,
	getCurrentDir,
	incrementMdHeaders,
	joinPath,
} from '@dovenv/core/utils'

import {
	pkgBadges,
	socialBadges,
} from './badges'
import pkg                 from '../../../../../package.json'
import { templatesPlugin } from '../../src/main'

const currDir    = getCurrentDir( import.meta.url )
const pkgDir     = joinPath( currDir, '..', '..' )
const wsDir      = joinPath( pkgDir, '..', '..', '..' )
const buildDir   = joinPath( pkgDir, 'build', 'paths' )
const partialDir = joinPath( currDir, 'partials' )
const tempDir    = joinPath( currDir, 'templates' )
const paths      = {
	pkgDir,
	partialDir,
	buildDir,
	tempDir,
	currDir,
}

export default defineConfig( [
	{ const : {
		pkg,
		wsDir,
		mark : async () => `\n${await asciiFont( `pigeonposse\n-------\n${pkg.extra.id}`, 'ansi--shadow' )}\n`,
		...paths,
	} },
	templatesPlugin( { test : {
		input : joinPath( tempDir, 'main.md' ),
		const : {
			pkgBadges : pkgBadges( {
				pkgName  : pkg.extra.id,
				repoName : pkg.extra.collective.id + '/' + ( pkg.extra.repoID ),
			} ),
			socialBadges : socialBadges( {
				...pkg.extra.collective.social,
				web    : pkg.extra.collective.web,
				about  : pkg.extra.collective.about,
				donate : pkg.extra.collective.funding,
			} ),
		},
		partial : {
			header  : { input: joinPath( partialDir, 'header.md' ) },
			footer  : { input: joinPath( partialDir, 'footer.md' ) },
			content : { input: `HOLA HOLA` },
		},
		hook : {
			// create api const before all
			before : async data => {

				const { Typescript2Markdown } = await import( '../../../convert/dist/main.mjs' )
				const converter               = new Typescript2Markdown( {
					input : joinPath( pkgDir, 'src', 'main.ts' ),
					opts  : {
						tsconfigPath    : joinPath( pkgDir, 'tsconfig.json' ),
						packageJsonPath : joinPath( pkgDir, 'package.json' ),
						typedocMarkdown : {
							hidePageHeader : true,
							hidePageTitle  : true,
						},
					},
				} )
				const res                     = await converter.run()
				const content                 = res.map( item => item.content ).join( '\n' )
				data.const.api                = `## Api documentation\n\n${incrementMdHeaders( content )}`

				return data

			},
			afterPartials : async data => {

				if ( !data.const ) data.const = {}

				data.const.toc = await geMDTocString( {
					input           : data.content,
					title           : 'Table of contents',
					removeH1        : true,
					maxHeadingLevel : 4,
				} )
				return data

			},
		},
		// opts   : { throw: true },
		output : joinPath( buildDir, 'example.md' ),
	} } ),
] )
