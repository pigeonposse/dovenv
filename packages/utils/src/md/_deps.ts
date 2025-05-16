import type { Marked }                     from 'marked'
import type { default as RehypeParse }     from 'rehype-parse'
import type { default as RehypeRemark }    from 'rehype-remark'
import type { default as RemarkParse }     from 'remark-parse'
import type { default as RemarkStringify } from 'remark-stringify'
import type { unified as UnifiedFn }       from 'unified'

import { LazyLoader } from '@/sys'

type LoaderMap = {
	'rehype-parse'     : () => Promise<typeof RehypeParse>
	'rehype-remark'    : () => Promise<typeof RehypeRemark>
	'remark-parse'     : () => Promise<typeof RemarkParse>
	'remark-stringify' : () => Promise<typeof RemarkStringify>
	'unified'          : () => Promise<typeof UnifiedFn>
	'marked'           : () => Promise<typeof Marked>
}

export const deps = new LazyLoader<LoaderMap>( {
	'rehype-parse'     : async () => ( await import( 'rehype-parse' ) ).default,
	'rehype-remark'    : async () => ( await import( 'rehype-remark' ) ).default,
	'remark-parse'     : async () => ( await import( 'remark-parse' ) ).default,
	'remark-stringify' : async () => ( await import( 'remark-stringify' ) ).default,
	'unified'          : async () => ( await import( 'unified' ) ).unified,
	'marked'           : async () => ( await import( 'marked' ) ).Marked,
} )

