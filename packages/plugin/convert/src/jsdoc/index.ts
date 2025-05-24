
import { LazyLoader } from '@dovenv/core/utils'

import { ConvertSuper } from '../_shared/main'

import type {
	ConvertPropsSuper,
	ConvertResponse,
	ConvertSuperInterface,
} from '../_shared/types'
import type jsdoc2md from 'jsdoc-to-markdown'

const _jsdocDeps = new LazyLoader( { jsdoc2md: async () => ( await import( 'jsdoc-to-markdown' ) ).default } )
export type Jsdoc2MarkdownProps = ConvertPropsSuper & { opts?: jsdoc2md.RenderOptions | jsdoc2md.JsdocOptions }

export class Jsdoc2Markdown extends ConvertSuper<Jsdoc2MarkdownProps> implements ConvertSuperInterface {

	props

	constructor( props: Jsdoc2MarkdownProps ) {

		super( props )
		this.props = props

	}

	async run(): Promise<ConvertResponse> {

		const jsdoc2md             = await _jsdocDeps.get( 'jsdoc2md' )
		const res: ConvertResponse = []

		await this._forEachContent( this.props.input, async i => {

			const content = await jsdoc2md.render( {
				// must be source because is content string
				'source'        : i.content,
				'no-cache'      : true,
				'heading-depth' : 2,
				...( this.props?.opts ? this.props.opts : {} ),
			} )

			// console.dir( {
			// 	content,
			// 	i,
			// }, { depth: null } )
			if ( this.props.output ) await this._writeOutput( this.props.output, i.id + '.md', content )

			res.push( {
				id : i.id,
				content,
			} )

		} )

		return res

	}

}
