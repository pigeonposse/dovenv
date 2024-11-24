import { defineConfig } from '../packages/core/dist/main.mjs'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
	getBaseName,
	asciiFont,
} from '../packages/utils/dist/main.mjs'

const currDir      = getCurrentDir( import.meta.url )
const workspaceDir = joinPath( currDir, '..' )
const pkg          = await getObjectFromJSONFile( joinPath( workspaceDir, 'package.json' ) )

export const customConfig = defineConfig( {
	const : {
		pkg  : pkg,
		workspaceDir,
		mark : `\n${asciiFont( `pigeonposse\n-------\n${pkg.extra.id}`, 'ANSI Shadow' )}\n`,
	},
	name      : 'DOVENV WORKSPACE',
	desc      : 'ToolKit for dovenv repository that uses the "dovenv" core and "pigeonposse" theme.',
	transform : { packages : {
		input : [
			'packages/{plugin,theme,config}/*/package.json',
			'packages/utils/package.json',
			'packages/core/package.json',
		],

		fn : async ( {
			path, content, const: consts,
		} ) => {

			const name = getBaseName( path.replace( 'package.json', '' ) )

			const basePaths = {
				utils  : _ => 'utils',
				core   : _ => 'core',
				theme  : name => `theme/${name}`,
				config : name => `config/${name}`,
				plugin : name => `plugin/${name}`,
			}

			const key       = Object.keys( basePaths ).find( key => path.includes( key ) ) || 'plugin'
			const ID        = basePaths[key]( name )
			const setWSdata = () => {

				const pkg = consts.pkg
				if ( !pkg ) throw new Error( `dovenv configuration must have "pkg" key in consts with the data of ws package` )
				if ( !pkg.repository.url ) throw new Error( `"repository.url" is required for exists in dovenv "pkg" consts` )
				else if ( !pkg.license ) throw new Error( `"license" is required for exists in dovenv "pkg" consts` )
				else if ( !pkg.funding ) throw new Error( `"funding" is required for exists in dovenv "pkg" consts` )
				else if ( !pkg.bugs ) throw new Error( `"bugs" is required for exists in dovenv "pkg" consts` )
				return {
					repoUrl : pkg.repository.url,
					license : pkg.license,
					funding : pkg.funding,
					bugs    : pkg.bugs,
				}

			}
			const wsData = setWSdata()
			const object = JSON.parse( content )

			if ( !object.private && !object.keywords ) throw new Error( `keywords are required for package: ${path}` )
			else if ( !object.private && object.keywords && ( !object.keywords.includes( 'pigeonposse' ) || !object.keywords.includes( 'pp' ) ||  !object.keywords.includes( 'dovenv' ) ) )
				throw new Error( `keywords must include 'pigeonposse', 'pp' and 'dovenv' for package: ${path}` )

			const data = {
				...object,
				homepage   : `https://dovenv.pigeonposse.com/guide/${ID}`,
				repository : {
					type      : 'git',
					url       : wsData.repoUrl,
					directory : `packages/${ID}`,
				},
				license : wsData.license,
				funding : wsData.funding,
				bugs    : wsData.bugs,
				...( consts.pkg.author ? { author: consts.pkg.author } : {} ),
			}

			return JSON.stringify( data, undefined, '\t' ) + '\n'

		},
	} },
} )
