import {
	setDirTree,
	box,
} from '@dovenv/utils'

import { defineConfig } from '../dist/main.mjs' // change it for @dovenv/core

const setStructure = () => {

	try {

		console.log( '\n' + box( setDirTree( { structure : {
			'.vscode' : {
				'settings.json'   : null,
				'extensions.json' : null,
			},
			'docs'             : { '*.md': null },
			'packages'         : { '**': null },
			'.gitignore'       : null,
			'.pigeonposse.yml' : null,
			'LICENSE'          : null,
			'package.json'     : null,
			'README.md'        : null,
		} } ),
		{
			padding     : 1,
			title       : 'Workspace Structure',
			borderStyle : 'double',
			borderColor : 'gray',
			dimBorder   : true,
		},
		),
		)

	}
	catch ( e ) {

		console.error( e.message )

	}

}
export default defineConfig( {
	name   : 'PROJECT WORKSPACE',
	desc   : 'This is a project workspace example',
	custom : { structure : {
		desc : 'Set structure for the workspace',
		fn   : async () => setStructure(),
	} },
} )
