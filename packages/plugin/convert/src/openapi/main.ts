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

		// need to fake argv because a issue with openapi-to-md
		const oldArgv = process.argv

		const input = await this._getContent( this.props.input )
		console.debug( { input } )
		const out = await this._getOutput()
		const dir = out.dir
		const res = []

		for ( const i of input ) {

			const path = joinPath( dir, i.id + '.md' )

			await convertMarkdown( i.content, path, this.props.opts?.sort )
			res.push( {
				id      : i.id,
				content : await readFile( path, 'utf-8' ),
			} )

		}

		await out.rmTempIfExist()
		process.argv = oldArgv
		return res

	}

}
