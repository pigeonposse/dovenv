import { defineConfig } from '@dovenv/core'

import { config } from '../src/main'

export default defineConfig( config( {
	commitlint : { gitmoji: true },
	eslint     : { flags: [ '--fix' ] },
	stylelint  : { configFile: 'stylelint.config.js' },
	staged     : { '**/*.{js,ts,jsx,tsx}': 'eslint' },
} ) )
