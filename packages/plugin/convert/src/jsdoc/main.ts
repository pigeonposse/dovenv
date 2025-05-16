/* eslint-disable @stylistic/object-curly-newline */

import { LazyLoader } from '@dovenv/core/utils'

import { ConvertSuper } from '../_shared/main'

import type {
	ConvertPropsSuper,
	ConvertSuperInterface,
} from '../_shared/types'
import type jsdoc2md from 'jsdoc-to-markdown'

const _jsdocDeps = new LazyLoader( {
	jsdoc2md : async () => ( await import( 'jsdoc-to-markdown' ) ).default,
} )
export type Jsdoc2MarkdownProps = ConvertPropsSuper & {
	/**
	 * Jsdoc options.
	 */
	opts? : jsdoc2md.RenderOptions | jsdoc2md.JsdocOptions
}

export class Jsdoc2Markdown extends ConvertSuper<Jsdoc2MarkdownProps> implements ConvertSuperInterface {

	props

	constructor( props: Jsdoc2MarkdownProps ) {

		super( props )
		this.props = props

	}

	async run() {

		const input    = await this._getContent( this.props.input )
		const jsdoc2md = await _jsdocDeps.get( 'jsdoc2md' )
		const res      = []
		for ( const i of input ) {

			const data    = await jsdoc2md.getTemplateData( { files: i.content } )
			const content = await jsdoc2md.render( {
				data,
				...( this.props?.opts ? this.props.opts : {} ),
			} )
			if ( this.props.output ) await this._writeOutput( this.props.output, i.id + '.md', content )

			res.push( {
				id : i.id,
				content,
			} )

		}

		return res

	}

}
