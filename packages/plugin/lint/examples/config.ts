import { defineConfig } from '@dovenv/core'

import { lintPlugin } from '../src/main'

export default defineConfig( lintPlugin( {
	commitlint : { gitmoji: true },
	eslint     : { flags: [ '--fix' ] },
	stylelint  : {
		configFile : 'stylelint.config.js',
		files      : '**/*.css',
	},
	staged : { '**/*.{js,ts,jsx,tsx}': 'eslint' },
	// custom : {
	// 	test : async ( { run } ) => {

	// 		await run.staged( { '**/*.{js,ts,jsx,tsx}': 'eslint' } )

	// 	},
	// 	test2 : async ( { run } ) => {

	// 		await run.eslint( { flags: [ '--fix' ] } )

	// 	},
	// },
} ) )
