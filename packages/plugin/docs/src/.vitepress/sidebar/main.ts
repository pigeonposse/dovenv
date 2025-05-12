import {
	deepmergeCustom,
	getBaseName,
	joinPath,
} from '@dovenv/core/utils'

import type {
	SetPath,
	SidebarProps,
} from './types'

const capitalize = ( s: string ) => s.charAt( 0 ).toUpperCase() + s.slice( 1 )

const setPath: SetPath = ( title, path, items = undefined, collapsed = undefined ) => {

	try {

		if ( items ) return [
			{
				text      : title,
				items     : items,
				collapsed : collapsed !== undefined && typeof collapsed === 'boolean' ? collapsed : undefined,
			},
		]
		else if ( path ) {

			path =  path?.startsWith( 'guide' ) && path.endsWith( 'index.md' )
				? joinPath( '/', path.replaceAll( 'index.md', '' ) )
				: path?.startsWith( 'guide' )
					? joinPath( '/', path )
					: path
			return [
				{
					text : title,
					link : path,
				},
			]

		}
		else return []

	}
	catch ( e ) {

		console.warn( `Error setting "${title}" path in sidebar`, {
			e,
			data : {
				title,
				path,
				items,
				collapsed,
			},
		} )

		return []

	}

}

const filtered = ( paths: string[] ) => {

	try {

		const processed = paths.map( page => {

			let name = capitalize( ( page.split( '/' ).pop() || '' ).replace( '.md', '' ) )
			if ( name.toLowerCase() === 'index' ) name = '🏁 Get started'
			return {
				name,
				path : page,
			}

		} )

		// Ordenar: 🏁 Get started primero, luego alfabéticamente por nombre
		const sorted = processed.sort( ( a, b ) => {

			if ( a.name === '🏁 Get started' ) return -1
			if ( b.name === '🏁 Get started' ) return 1
			return a.name.localeCompare( b.name )

		} )

		// Aplicar setPath después de ordenar
		return sorted.flatMap( item => setPath( item.name, item.path ) )

	}
	catch ( e ) {

		console.warn( `Error getting filtered sidebar paths`, {
			e,
			data : { paths },
		} )

		return []

	}

}

const filteredGroup = ( paths: string[], group: number = 0 ) => {

	try {

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
			return setPath(
				capitalize( k ), k,
				filtered( value ),
				k === 'core' ? false : true,
			)

		} )

		return res

	}
	catch ( e ) {

		console.warn( `Error getting filtered group sidebar paths`, {
			e,
			data : {
				paths,
				group,
			},
		} )

		return []

	}

}

const getGuide = ( guide: SidebarProps['guide'], conf: SidebarProps['conf'] ) => {

	if ( !guide || guide.length === 0 ) return []

	const guidePath     = '/guide/'
	const filteredIndex = guide.filter( page => page.split( '/' ).length === 2 && page !== 'guide/index.md' )

	const index             = guide.includes( 'guide/index.md' ) ? 'guide/index.md' : undefined
	const getReferenceItems = () => {

		const items = filteredGroup( guide )
		if ( !items.length ) return []
		return [
			{
				text : 'Reference',
				items,
			},
		]

	}

	return [
		...( ( conf?.autoSidebar?.intro !== undefined && conf.autoSidebar.intro === false )
			? []
			: setPath(
				'Introduction',
				index,
				[ ...setPath( `What is ${conf.name}?`, guidePath ), ...filtered( filteredIndex ) ],
			)
		),
		...( ( conf?.autoSidebar?.reference !== undefined && conf.autoSidebar.reference === false )
			? []
			: getReferenceItems()
		),
	]

}
const sidebarConstructor = ( {
	conf, guide, contributors, todo,
}: SidebarProps ) => {

	const todoPath = todo && todo.length === 1 ? todo[0] : undefined

	const todoPaths = todo && todo.length > 1
		? todo.map( d => setPath( capitalize( getBaseName( d.replace( '.md', '' ) ) ), d ) ).flat()
		: undefined

	const todoRes      = setPath(
		'Todo',
		todoPath,
		todoPaths,
		true,
	)
	const getContItems = () => {

		const items = [ ...setPath( 'Report issues', conf.bugsURL || undefined ), ...todoRes ]
		if ( !items.length ) return []
		return [
			{
				text : 'Contribute',
				items,
			},
		]

	}
	const getAboutItems = () => {

		const items =  [
			...setPath( 'Contributors', contributors ),
			...setPath( 'Changelog', conf.changelogURL || undefined ),
			...setPath( 'License', conf.license?.url ),
			...setPath( 'More projects', conf.moreURL || undefined ),
		]
		if ( !items.length ) return []
		return [
			{
				text : 'About',
				items,
			},
		]

	}
	return [
		...getGuide( guide, conf ),
		...( ( conf?.autoSidebar?.contribute !== undefined && conf.autoSidebar.contribute === false )
			? []
			: getContItems()
		),
		...( ( conf?.autoSidebar?.about !== undefined && conf.autoSidebar.about === false )
			? []
			: getAboutItems() ),
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
