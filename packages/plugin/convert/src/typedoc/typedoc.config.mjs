/**
 * Typedoc config.
 * @see https://typedoc.org/options/output/
 * @see https://typedoc-plugin-markdown.org/docs/options/
 */

/** @type {Partial<import('typedoc').TypeDocOptions>} */
export default {
	plugin : [ 'typedoc-plugin-markdown', './custom-plugin.mjs' ],

	logLevel         : 'Verbose',
	disableSources   : true,
	readme           : 'none',
	excludePrivate   : true,
	excludeProtected : true,
	groupOrder       : [
		'Classes',
		'Functions',
		'Type Aliases',
		'*',
	],

	// frontmatter
	// frontmatterGlobals    : { outline: [ 2, 5 ] },

	// markdown
	// @see https://typedoc-plugin-markdown.org/docs/options/
	hidePageHeader        : true,
	hidePageTitle         : true,
	useCodeBlocks         : true,
	expandObjects         : true,
	indexFormat           : 'list',
	classPropertiesFormat : 'table',
	typeDeclarationFormat : 'table',
	parametersFormat      : 'table',
	// hideGroupHeadings     : true,
	outputFileStrategy    : 'modules',
	expandParameters      : true,
	flattenOutputFiles    : false,

}
