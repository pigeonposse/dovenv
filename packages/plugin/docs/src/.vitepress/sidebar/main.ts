import {
	deepmergeCustom,
	getDirName,
} from '@dovenv/utils'

import type { DocsConfig } from '../config/types'

type SidebarProps = {
	conf          : DocsConfig
	guide?        : string[]
	todo?         : string[]
	contributors? : string
	links?        : string
}

type SetPath = ( title: string, path?: string, items?: ReturnedType, collapsed?: boolean ) => ReturnedType
type ReturnedType = {
	text   : string
	link?  : string
	items? : ReturnType<SetPath>
}[]
const setPath: SetPath = ( title, path, items = undefined, collapsed = undefined )  => ( path
	? [
		items
			? {
				text      : title,
				items     : items,
				collapsed : collapsed !== undefined  && typeof collapsed === 'boolean' ? collapsed : undefined,
			}
			: {
				text : title,
				link : path,
			},
	]
	: []
)

const capitalize = ( s: string ) => s.charAt( 0 ).toUpperCase() + s.slice( 1 )

const filtered = ( paths: string[] ) => paths.map( page => {

	let name = capitalize( ( page.split( '/' ).pop() || '' ).replace( '.md', '' ) )
	if ( name === 'index' ) name = '🏁 Get started'
	return setPath(  name, page )

} ).flat()

const filteredGroup = ( paths: string[], group: number = 0 ) => {

	const filteredPaths                          = paths.filter( page => page.split( '/' ).length === 3 )
	const position                               = group + 1
	const groupedPages: Record<string, string[]> = {}
	for ( let i = 0; i < filteredPaths.length; i++ ) {

		const page       = filteredPaths[i]
		const parts      = page.split( '/' )
		const secondPart = parts[position]

		if ( secondPart ) {

			if ( !groupedPages[secondPart] ) groupedPages[secondPart] = []
			groupedPages[secondPart].push( page )

		}

	}
	const res = Object.keys( groupedPages ).flatMap( k => {

		const value = groupedPages[k]
		if ( value.length === 1 ) return setPath( capitalize( k ), value[0] )
		return setPath( capitalize( k ), k, filtered( value ), k === 'core' ? false : true )

	} )

	return res

}

const getGuide = ( guide: SidebarProps['guide'], conf: SidebarProps['conf'] ) => {

	if ( !guide || guide.length === 0 ) return []

	const guidePath     = '/guide/'
	const filteredIndex = guide.filter( page => page.split( '/' ).length === 2 && page !== 'guide/index.md' )

	const index = guide.includes( 'guide/index.md' ) ? 'guide/index.md' : undefined

	return [
		...setPath(
			'Introduction',
			index,
			[ ...setPath( `What is ${conf.name}?`, guidePath ), ...filtered( filteredIndex ) ],
		),
		{
			text  : 'Reference',
			items : filteredGroup( guide ),
		},
	]

}
const sidebarConstructor = ( {
	conf, guide, contributors, todo,
}: SidebarProps ) => {

	const todoPath = todo && todo.length == 1 ? todo[0] : undefined

	const todoPaths = todo && todo.length > 1
		? todo.forEach( d => setPath( getDirName( d ), d ) ) as ReturnedType | undefined
		: undefined

	return [
		...getGuide( guide, conf ),
		{
			text  : 'Contribute',
			items : [
				...setPath( 'Report issues', conf.bugsUrl ),
				...setPath(
					'Todo',
					todoPath,
					todoPaths,
				),
			],
		},
		{
			text  : 'About',
			items : [
				...setPath( 'Contributors', contributors ),
				...setPath( 'Changelog', conf.changelogUrl ),
				...setPath( 'License', conf.license.url ),
				...setPath( 'More projects', conf.moreUrl ),
			],
		},
	]

}
export const setSidebar =  ( {
	conf, guide, contributors, todo,
} : SidebarProps ) => ( deepmergeCustom( {} )( conf.sidebar ? conf.sidebar : {}, {
	'/guide/' : sidebarConstructor( {
		conf,
		guide,
		contributors,
		todo,
	} ),
	'/todo/' : sidebarConstructor( {
		conf,
		guide,
		contributors,
		todo,
	} ),
	'/contributors' : sidebarConstructor( {
		conf,
		guide,
		contributors,
		todo,
	} ),
} ) )
