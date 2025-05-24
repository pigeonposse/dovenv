
import {
	CreatiumCore,
	prompt,
	sys,
	style,
	INSTALLER,
} from 'creatium'
import latestVersion from 'latest-version'

import {
	getCoreStyleOpts,
	getProjectNameInPascalCase,
	mapObject,
} from './_utils'
import {
	GET_PARTIAL_DIR,
	THEME_META,
	version,
	homepage,
	description,
	name,
	PLUGIN_META,
	CORE_META,
	LANGUAGE,
	THEME_ID,
	PLUGIN_ID,
	CORE_BIN_NAME,
} from './const'

import type { CustomParams } from './types'

export type CreateTemplateParams = Omit<Awaited<ReturnType<typeof core.cli>>, 'plugin' | 'theme' | 'lang'> & CustomParams

const {
	color,
	table,
} = style
const {
	copyDir,
	joinPath: join,
} = sys

const cancelFn = ( ) => {

	prompt.cancel( color.red( 'Operation canceled 💔' ) )
	process.exit( 0 )

}
const styleOpt = getCoreStyleOpts()

export const core = new CreatiumCore( {
	name,
	version,
	updater  : true,
	cache    : true,
	onCancel : cancelFn,
	prompt   : {
		intro : {
			type : 'void',
			desc : 'Project info',
			fn   : ( ) => {

				const tableData = [ [ 'Version', version ], [ 'Documentation', homepage ] ]
					.map( v => [ color.dim( color.bold( v[0] ) ), color.dim( color.italic( v[1] ) ) ] )

				const value = `${table( [ [ color.dim( description ) ], [ '' ] ], styleOpt.table )}\n${table( tableData, styleOpt.table )}\n`
				prompt.box( {
					value : value,
					opts  : styleOpt.box,
				} )

			},
		},

		output : {
			type  : 'output',
			alias : [ 'o' ],
		},
		name : {
			type  : 'name',
			alias : [ 'n' ],
		},
		monorepo : {
			type      : 'boolean',
			desc      : `Set if you want to Create a monorepo`,
			promptMsg : `Do you want to create a monorepo?`,
		},
		lang : {
			type      : 'select',
			desc      : `Select a project language`,
			promptMsg : 'What language do you want to use?',
			options   : {
				[LANGUAGE.js] : { name: 'JavaScript project' },
				[LANGUAGE.ts] : { name: 'TypeScript project' },
			},
		},
		theme : {
			type    : 'select',
			desc    : `Install a ${name} theme`,
			options : {
				[THEME_ID.none] : {
					name : 'None',
					desc : 'Without theme',
				},
				...mapObject( THEME_META, theme => ( {
					name : theme.name,
					desc : theme.description,
				} ) ),
			},
		},
		plugin : {
			type    : 'multiselect',
			desc    : `Install a ${name} plugin`,
			options : {
				[PLUGIN_ID.none] : {
					name : 'None',
					desc : 'Without Plugins',
				},
				...mapObject( PLUGIN_META, theme => ( {
					name : theme.name,
					desc : theme.description,
				} ) ),
			},
		},
		install : { type: 'install' },
		open    : { type: 'openEditor' },
	},
} )

/**
 * Function for create a new project template.
 *
 * @param   {CreateTemplateParams} params - The values to create the template.
 * @returns {Promise<void>}               - A promise that resolves when the template is created.
 */
export const createTemplate = async ( params: CreateTemplateParams ) => {

	const spinner = prompt.spinner()
	try {

		const {
			output,
			install,
			open: openEditor,
			monorepo,
			lang,
			theme,
			plugin,
			name: projectName,
			// extract constants for used in createTemplate
			...consts
		} = params

		if ( !output ) throw new Error( 'Output is required' )
		if ( !projectName ) throw new Error( 'Project name is required' )

		spinner.start( 'Creating project' )

		//////////////////////////////////////////////////////////////////////////////////
		// Copy the partials

		spinner.message( 'Copying partials' )
		const PARTIAL_DIR = await GET_PARTIAL_DIR()
		// await ensureDir( output )

		await copyDir( {
			input : PARTIAL_DIR.workspace,
			output,
		} )

		if ( monorepo ) {

			await copyDir( {
				input : PARTIAL_DIR.monorepo,
				output,
			} )

			if ( install === INSTALLER.PNPM ) await copyDir( {
				input : PARTIAL_DIR.monorepoPnpm,
				output,
			} )

		}

		await copyDir( {
			input  : lang === LANGUAGE.ts ? PARTIAL_DIR.srcTS : PARTIAL_DIR.srcJS,
			output : monorepo ? join( output, 'packages', 'core' ) : output,
		} )

		if ( plugin?.includes( 'lint' ) ) await copyDir( {
			input : PARTIAL_DIR.lint,
			output,
		} )

		//////////////////////////////////////////////////////////////////////////////////
		// Define the package.json
		spinner.message( 'Defining package.json' )

		const pkg = {
			name            : projectName,
			license         : 'GPL-3.0',
			type            : 'module',
			scripts         : { [CORE_BIN_NAME]: CORE_BIN_NAME },
			devDependencies : { [CORE_META.name]: CORE_META.version },
		}

		// @ts-ignore
		if ( monorepo ) pkg.workspace = 'packages/*'
		// @ts-ignore
		else pkg.version = '0.0.1'

		if ( theme && theme !== THEME_ID.none ) {

			// @ts-ignore
			const data = THEME_META[theme] as typeof THEME_META[ keyof typeof THEME_META]

			pkg.devDependencies = {
				...pkg.devDependencies,
				[data.name] : data.version,
			}

		}

		const dataPlugin: ( {
			import : string
			config : string
		} )[] = []

		if ( plugin && !plugin.includes( PLUGIN_ID.none ) ) {

			for ( const key of plugin ) {

				// @ts-ignore
				const data = PLUGIN_META[key] as typeof PLUGIN_META[ keyof typeof PLUGIN_META]

				pkg.devDependencies = {
					...pkg.devDependencies,
					[data.name] : data.version,
				}
				const pluginName    = 'plugin' + getProjectNameInPascalCase( data.name )
				dataPlugin.push( {
					import : `import { config as ${pluginName} } from '${data.name}'`,
					config : `${pluginName}()`,
				} )

			}

		}

		if ( lang === LANGUAGE.ts ) {

			pkg.devDependencies = {
				...pkg.devDependencies,
				'@types/node' : await latestVersion( '@types/node' ),
				'tslib'       : await latestVersion( 'tslib' ),
				'tsx'         : await latestVersion( 'tsx' ),
				'typescript'  : await latestVersion( 'typescript' ),
			}

		}

		//////////////////////////////////////////////////////////////////////////////////
		// Define the dovenv config

		spinner.message( 'Defining dovenv config' )
		const getPluginDovenvConfig = () => {

			if ( !dataPlugin || dataPlugin.length === 0 ) return ''

			const imports        = dataPlugin.map( item => item.import ).join( '\n' )
			const configurations = dataPlugin.map( item => item.config ).join( ',\n  ' )

			return `
import { defineConfig } from '@dovenv/core'
${imports}

export default defineConfig({
	${configurations}
});
			`.trim()

		}
		const dovenvConfig = theme === THEME_ID.pigeonposse
			? `
import { config as pigeonposseTheme } from '${THEME_META[theme].name}'

export default pigeonposseTheme({
})

		`
			: theme === THEME_ID.banda
				? `
import { config as pigeonposseTheme } from '${THEME_META[theme].name}'

export default pigeonposseTheme({
})
`
				: getPluginDovenvConfig()

		spinner.stop( 'Configuration conpleted' )

		//////////////////////////////////////////////////////////////////////////////////
		// Create the template
		await core.replacePlaceholders( {
			input  : output,
			params : {
				name    : name,
				version : version,
				consts  : {
					...consts,
					dovenvConfig,
					pkg : JSON.stringify( pkg, null, 2 ),
				},
				prompt : params,

			},
		} )

		await core.install( {
			installer : install,
			input     : output,
		} )
		await core.openEditor( {
			editor : openEditor,
			input  : output,
		} )

		await core.outro( )

		// await core.createTemplate( {
		// 	output,
		// 	input,
		// 	install,
		// 	openEditor,
		// 	name,
		// 	consts : {
		// 		...consts,
		// 		dovenvConfig,
		// 		pkg : JSON.stringify( pkg, null, 2 ),
		// 	},
		// } )

	}
	catch ( error ) {

		spinner.stop( 'Configuration failed', 0 )

		prompt.log.step( '' )

		if ( error instanceof Error )
			prompt.log.error( color.red( error.message ) )
		else
			console.error( 'Unexpected error:', error )

		prompt.log.step( '' )
		cancelFn()

	}

}
