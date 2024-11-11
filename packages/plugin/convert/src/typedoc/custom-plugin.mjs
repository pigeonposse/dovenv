import {
	getFilesSync,
	joinPath,
	paths,
	readFileSync,
	readJSON,
	readJSONSync,
	writeFileSync,
} from '@dovenv/utils'
import { MarkdownPageEvent } from 'typedoc-plugin-markdown'

import { ENV_KEY }  from './consts.mjs'
import {
	readmeUtils,
	readmeUtilsDocs,
} from '../templates/readme-utils.mjs'

const mainPKG = await readJSON( joinPath( paths.workspacePkg ) )

/**
 * Load [typedoc] plugin.
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app - MarkdownApplication.
 * @example // nothing
 */
export function load( app ) {

	app.renderer.on( MarkdownPageEvent.END, page => {

		try {

			console.log( 'MarkdownPageEvent.END triggered' )
			const PKG_DIR          = joinPath( process.env[ENV_KEY.PROJECT_DIR], 'package.json' )
			const PKG_README       = joinPath( process.env[ENV_KEY.PROJECT_DIR], 'README.md' )
			const PKG_EXAMPLES_DIR = joinPath( process.env[ENV_KEY.PROJECT_DIR], 'examples' )
			const PKG              = readJSONSync( PKG_DIR )
			const PKG_EXAMPLES     = getFilesSync( PKG_EXAMPLES_DIR )

			let examples = ''
			for ( let index = 0; index < PKG_EXAMPLES.length; index++ ) {

				const PKG_EXAMPLE = PKG_EXAMPLES[index]
				const type        = PKG_EXAMPLE.endsWith( 'js' ) ? 'js' : PKG_EXAMPLE.endsWith( 'ts' ) ? 'ts' : undefined

				if ( type ) {

					const content = readFileSync( PKG_EXAMPLE )
					examples      = '```' + type + ' twoslash\n' + content + '```\n'

				}

			}
			// console.log( examples )
			const data     = {
				PKG,
				mainPKG,
				content  : page.contents,
				examples : examples === '' ? undefined : examples,
			}
			const readme   = readmeUtils( data )
			const contents = readmeUtilsDocs( data )

			// console.log( {
			// 	PKG_DIR,
			// 	PKG_README,
			// 	data,
			// 	readme,
			// 	contents,
			// } )

			page.contents = contents
			// page.contents += contents
			writeFileSync( PKG_README, readme )
			console.log( 'MarkdownPageEvent.END finished' )

		}
		catch ( e ) {

			console.log( e )

		}

	} )

}
