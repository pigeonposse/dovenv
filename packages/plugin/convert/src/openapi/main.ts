/* eslint-disable @stylistic/object-curly-newline */
import {
	joinPath,
	readFile,
} from '@dovenv/core/utils'

import { ConvertSuper } from '../_shared/main'

import type {
	ConvertPropsSuper,
	ConvertSuperInterface,
} from '../_shared/types'

export type Openapi2MarkdownProps = ConvertPropsSuper & {
	/**
	 * Openapi options
	 */
	opts?: {
	/**
	 * Sort titles by atoz
	 */
		sort? : boolean
	}
}

export class Openapi2Markdown extends ConvertSuper<Openapi2MarkdownProps> implements ConvertSuperInterface {

	props

	constructor( props: Openapi2MarkdownProps ) {

		super( props )
		this.props = props

	}

	async run() {

		const { convertMarkdown } = await import( 'openapi-to-md' )
		const input               = await this._getContent( this.props.input )
		const res                 = []
		const out                 = await this._getOutput()
		const dir                 = out.dir
		for ( const i of input ) {

			const path = joinPath( dir, i.id )
			await convertMarkdown( i.content, path, this.props.opts?.sort )
			res.push( {
				id      : i.id,
				content : await readFile( path, 'utf-8' ),
			} )

		}

		await out.rmTempIfExist()

		return res

	}

}
