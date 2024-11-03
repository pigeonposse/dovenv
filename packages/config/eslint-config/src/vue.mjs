/**
 * VUE
 */
import pluginVue from 'eslint-plugin-vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
	...pluginVue.configs['flat/recommended'],
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
