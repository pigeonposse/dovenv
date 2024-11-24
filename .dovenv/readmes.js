import {
	markSchema,
	pkgSchema,
	validateSchema,
} from './schema.js'
import { defineConfig }        from '../packages/core/dist/main.mjs'
import { Typescript2Markdown } from '../packages/plugin/convert/dist/main.mjs'
import {
	getCurrentDir,
	getMD,
	getObjectFromJSONFile,
	joinPath,
	replacePlaceholders,
	color,
	geMDTocString,
	writeFileContent,
	existsFile,
	incrementMdHeaders,
} from '../packages/utils/dist/main.mjs'

export default defineConfig( { custom : { readmes : {
	desc : 'Create package readmes simultaneously',
	fn   : async ( { config } ) => {

		try {

			if ( !config.const.pkg ) throw 'Must exist [pkg] const in dovenv configuration'
			if ( !config.const.mark ) throw 'Must exist [mark] const in dovenv config.\nThis must be a text, for example a watermark, a trademark, or a simple text about the project.'

			await validateSchema( pkgSchema, config.const.pkg, 'pkg' )
			await validateSchema( markSchema, config.const.mark, 'mark' )

			const projectPath        = joinPath( 'packages', 'core' )
			const readmeTemplatePath = joinPath( getCurrentDir( import.meta.url ), 'templates', 'readme.md' )
			const readmePath         = joinPath( projectPath, 'README.md' )
			const contentPath        = joinPath( projectPath, 'docs', 'index.md' )
			const projectPackage     = joinPath( projectPath, 'package.json' )
			const inputPath          = joinPath( projectPath, 'src', 'main.ts' )
			const tsconfigPath       = joinPath( projectPath, 'tsconfig.json' )
			const data               = await getObjectFromJSONFile( projectPackage )

			const ts2md = new Typescript2Markdown( {
				input : [ inputPath ],
				opts  : {
					tsconfigPath    : tsconfigPath,
					packageJsonPath : projectPackage,
					typedocMarkdown : {
						hidePageHeader : true,
						hidePageTitle  : true,
					},
				},
			} )

			let { content: api } = ( await ts2md.run() )[0]

			api = `## Api documentation\n\n` + await incrementMdHeaders( api )

			const content          = await existsFile( contentPath ) ? await incrementMdHeaders( await getMD( contentPath ) ) : ''
			const readmeTemplate   = await getMD( readmeTemplatePath )
			const readmeContentPre = await replacePlaceholders( {
				content : readmeTemplate,
				params  : {
					pkg   : config.const.pkg,
					desc  : data.description,
					title : data.name,
					content,
					api   : api,
					mark  : config.const.mark,
				},
			} )
			const readmeContent    = await replacePlaceholders( {
				content : readmeContentPre,
				params  : { toc : await geMDTocString( {
					input           : readmeContentPre,
					title           : 'Table of contents',
					removeH1        : true,
					maxHeadingLevel : 4,
				} ) },
			} )

			await writeFileContent( readmePath, readmeContent )
			console.log( color.green( 'Successfully created' ) )

		}
		catch ( e ) {

			console.error( color.red( e ) )

		}

	},
} } } )
