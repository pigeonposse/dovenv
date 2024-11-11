import type { DocsConfig } from '../../config/types'

export type SidebarProps = {
	conf          : DocsConfig
	guide?        : string[]
	todo?         : string[]
	contributors? : string
	links?        : string
}

export type SetPath = ( title: string, path?: string, items?: ReturnedType, collapsed?: boolean ) => ReturnedType
export type ReturnedType = {
	text   : string
	link?  : string
	items? : ReturnType<SetPath>
}[]
