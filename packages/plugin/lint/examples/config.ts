import { defineConfig } from 'dovenv'

import { config } from '../src/main'

export default defineConfig( config( {
	stylelint : { configFile: 'stylelint.config.js' },
	staged    : { '**/*.{js,ts,jsx,tsx}': 'eslint' },
} ) )
