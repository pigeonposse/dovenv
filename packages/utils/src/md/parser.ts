import remarkParse     from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified }     from 'unified'

import type { Root } from 'mdast'

const mdProcessor = unified().use( remarkParse ).use( remarkStringify )

type MarkdownObject = Root

export const deserialize = ( str: string ) => mdProcessor.parse( str )

export const serialize = ( obj: MarkdownObject ) => mdProcessor.stringify( obj )