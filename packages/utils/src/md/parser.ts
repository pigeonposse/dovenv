import remarkParse     from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified }     from 'unified'

const processor = unified().use( remarkParse ).use( remarkStringify )
type MarkdownObject = ReturnType<( typeof processor )['parse']>

export const deserialize = ( str: string ): MarkdownObject => processor.parse( str )

export const serialize = ( obj: MarkdownObject ): string => processor.stringify( obj )
