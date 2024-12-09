import { TypescriptSuper } from './_shared'

import type { Typescript2HtmlProps }  from './types'
import type { ConvertSuperInterface } from '../_shared/types'

export class Typescript2Html extends TypescriptSuper<Typescript2HtmlProps> implements ConvertSuperInterface {

	constructor( props: Typescript2HtmlProps ) {

		super( props )
		this.props = props

	}

	async run() {

		return await this.runTypedoc()

	}

}
