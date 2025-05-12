import remarkParse     from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified }     from 'unified'

import type { Processor } from 'unified'

import { Any } from '@/ts'

const processor = unified().use( remarkParse ).use( remarkStringify )
type MarkdownObject = ReturnType<Processor['parse']>

export const deserialize = ( str: string ): MarkdownObject => processor.parse( str )

export const serialize = ( obj: MarkdownObject ): string => processor.stringify( obj as Any )
