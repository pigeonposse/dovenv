import { TypescriptSuper } from './_shared'

import type { Typescript2MarkdownProps } from './types'
import type { ConvertSuperInterface }    from '../_shared/types'
import type { PluginOptions }            from 'typedoc-plugin-markdown'

export class Typescript2Markdown extends TypescriptSuper<Typescript2MarkdownProps> implements ConvertSuperInterface {

	props

	constructor( props: Typescript2MarkdownProps ) {

		super( props )
		this.props = props

	}

	async run() {

		const props = this.props.opts || {}

		const { typedocMarkdown } = props

		/**
		 * Markdown..
		 *
		 * @see https://typedoc-plugin-markdown.org/docs/options
		 */
		const configMD: Partial<PluginOptions> = {
			entryFileName         : 'index',
			fileExtension         : '.md',
			outputFileStrategy    : 'modules',
			// flattenOutputFiles        : false,
			// hidePageHeader        : true,
			// hidePageTitle         : true,
			// hideGroupHeadings     : true,
			/**
			 * @see https://typedoc-plugin-markdown.org/docs/options/display-options
			 */
			expandObjects         : true,
			expandParameters      : true,
			useCodeBlocks         : true,
			hideBreadcrumbs       : true,
			hidePageHeader        : true,
			indexFormat           : 'list',
			classPropertiesFormat : 'table',
			typeDeclarationFormat : 'table',
			parametersFormat      : 'table',
			// typeDeclarationVisibility : 'compact',
			/**
			 * @see https://typedoc-plugin-markdown.org/docs/options/utility-options#--sanitizecomments
			 */
			sanitizeComments      : true,

		}
		const appConfig                        = {
			...configMD,
			...( typedocMarkdown ? typedocMarkdown : {} ),
			plugin : [ 'typedoc-plugin-markdown' ],
		}

		return this.runTypedoc( appConfig )

	}

}
