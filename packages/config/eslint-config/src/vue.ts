import pluginVue from 'eslint-plugin-vue'

import { FILES } from './const'

import type { Config } from './_types'

/**
 * Generates an ESLint configuration for Vue.js files.
 *
 * This configuration extends the 'flat/strongly-recommended' rules from `eslint-plugin-vue`
 * and applies specific rules for Vue files.
 *
 * @returns {Config[]} An array of configuration objects for Vue.js linting.
 * @see https://www.npmjs.com/package/eslint-plugin-vue
 */
export const setVueConfig = (): Config[] => [
	...pluginVue.configs['flat/strongly-recommended'].map( d => ( {
		files : [ FILES.VUE ],
		...d,
	} ) ),
	{
		files : [ FILES.VUE ],
		rules : {
			'jsdoc/require-jsdoc' : 'off',
			'vue/html-indent'     : [
				'error',
				'tab',
				{},
			],
			'vue/html-comment-indent'        : [ 'error', 'tab' ],
			'vue/multi-word-component-names' : [ 'off' ],
		},

	},
]

/**
 * VUE ESLINT CONFIG.
 *
 * @see https://www.npmjs.com/package/eslint-plugin-vue
 */
export const vueConfig = setVueConfig()

