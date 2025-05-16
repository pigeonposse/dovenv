import { deps } from './_deps'

import type { Processor } from 'unified'

import { Any } from '@/ts'

type MarkdownObject = ReturnType<Processor['parse']>

export type MDParser = {
	deserialize : ( str: string ) => MarkdownObject
	serialize   : ( obj: MarkdownObject ) => string
}
export const mdParser = async (): Promise<MDParser> => {

	const unified         = await deps.get( 'unified' )
	const remarkParse     = await deps.get( 'remark-parse' )
	const remarkStringify = await deps.get( 'remark-stringify' )

	const processor = unified().use( remarkParse ).use( remarkStringify )

	return {
		deserialize : str => processor.parse( str ),
		serialize   : obj => processor.stringify( obj as Any ),
	}

}

