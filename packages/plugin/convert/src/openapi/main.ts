/* eslint-disable @stylistic/object-curly-newline */
import {
	joinPath,
	readFile,
	process,
} from '@dovenv/core/utils'

import { ConvertSuper }    from '../_shared/main'
import { convertMarkdown } from './core/main'

import type {
	ConvertPropsSuper,
	ConvertResponse,
	ConvertSuperInterface,
} from '../_shared/types'

export type Openapi2MarkdownProps = ConvertPropsSuper & {
	/**
	 * Openapi options.
	 */
	opts?: {
		/**
		 * Sort titles by atoz.
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

	async run(): Promise<ConvertResponse> {

		// need to fake argv because a issue with openapi-to-md
		const oldArgv = process.argv

		const out = await this._getOutput()

		const res: ConvertResponse = []

		await this._forEachContent( this.props.input, async i => {

			const path = joinPath( out.dir, i.id + '.md' )

			await convertMarkdown( i.content, path, this.props.opts?.sort )
			res.push( {
				id      : i.id,
				content : await readFile( path, 'utf-8' ),
			} )

		} )

		await out.rmTempIfExist()
		process.argv = oldArgv
		return res

	}

}
