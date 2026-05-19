import { defineConfig } from 'oxlint'

import eslintConfig from './eslint.config.js'

// Reducimos todo el array de ESLint a un único objeto plano de reglas
const unifiedRules = eslintConfig.reduce( ( acc, config ) => {

	if ( config.rules ) {

		Object.assign( acc, config.rules )

	}
	return acc

}, {} )

export default defineConfig( {
	// Pasamos el objeto limpio con la estructura que espera Oxlint
	rules : unifiedRules,
} )
