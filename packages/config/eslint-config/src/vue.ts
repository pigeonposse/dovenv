/**
 * VUE
 */

import pluginVue from 'eslint-plugin-vue'

import type { Config } from './_types'

const config: Config[] = [
	...pluginVue.configs['flat/strongly-recommended'],
	{
		files : [ '**/*.vue' ],
		rules : {
			'vue/html-indent' : [
				'error',
				'tab',
				{},
			],
			'vue/html-comment-indent'        : [ 'error', 'tab' ],
			'vue/multi-word-component-names' : [ 'off' ],
		},

	},
]

export default config
