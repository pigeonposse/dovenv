// @ts-ignore
import { Initium } from 'initium'

const core = new Initium( {
	updater   : true,
	name      : 'dovenv',
	version   : '0.0.1',
	templates : {
		js : {
			input     : 'my/js/code/folder',
			// @ts-ignore
			transform : async ( path, data, utils ) => {

				const pkg    = await utils.readFile( utils.join( path, 'package.json' ) )
				const result = await utils.replacePlaceholders( {
					content : pkg,
					name    : data.name,
					desc    : data.desc,
				} )
				return result

			},
		},
		ts : { input: 'my/ts/code/folder' },
	},
	// @ts-ignore
	exec : async prompt => await prompt
		.input( 'Where do you want create a new project?' )
		.name( 'Set name of project' )
		.custom.input( {
			id       : 'desc',
			desc     : 'Change the description',
			required : true,
		} )
		.template()
		.install( [
			'deno',
			'npm',
			'pnpm',
			'yarn',
		] )
		.openIDE( [
			'code',
			'subl',
			'webstorm',
		] ),
	// prompt : {
	// 	input : { desc: 'Where do you want create a new project?' },
	// 	name  : { desc: 'Set name of project' },
	// },
} )

// for use in cli
core.cli( { args: process.argv } )

// for use in library mode
core.create( {
	input    : process.cwd(),
	name     : 'dovenv',
	desc     : 'my description',
	template : 'js',
	install  : 'yarn',
	open     : undefined,
}, { args: process.argv } )
