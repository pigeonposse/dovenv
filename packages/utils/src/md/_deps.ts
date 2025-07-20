import type { Marked } from 'marked'

import { LazyLoader } from '@/sys'

type LoaderMap = { marked: () => Promise<typeof Marked> }

export const deps = new LazyLoader<LoaderMap>( { marked: async () => ( await import( 'marked' ) ).Marked } )

