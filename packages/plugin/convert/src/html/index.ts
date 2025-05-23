
import {
	html2md,
	md2html,
} from '@dovenv/core/utils'

import { ConvertSuper } from '../_shared/main'

import type {
	ConvertPropsSuper,
	ConvertResponse,
	ConvertSuperInterface,
} from '../_shared/types'

export type Html2MarkdownProps = ConvertPropsSuper
export type Markdown2HtmlProps = ConvertPropsSuper

export class Html2Markdown extends ConvertSuper<Html2MarkdownProps> {

	props

	constructor( props: Html2MarkdownProps ) {

		super( props )
		this.props = props

	}

	async run() {

		const res: ConvertResponse = []

		await this._forEachContent( this.props.input, async i => {

			const content = await html2md( i.content )
			res.push( {
				id : i.id,
				content,
			} )
			if ( this.props.output ) await this._writeOutput( this.props.output, i.id, content )

		} )

		return res

	}

}

export class Markdown2Html extends ConvertSuper<Markdown2HtmlProps> implements ConvertSuperInterface {

	props

	constructor( props: Markdown2HtmlProps ) {

		super( props )
		this.props = props

	}

	async run(): Promise<ConvertResponse> {

		const res: ConvertResponse = []

		await this._forEachContent( this.props.input, async i => {

			const content = await md2html( i.content )
			res.push( {
				id : i.id,
				content,
			} )
			if ( this.props.output ) await this._writeOutput( this.props.output, i.id, content )

		} )

		return res

	}

}
