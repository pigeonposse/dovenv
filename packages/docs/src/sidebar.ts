import { capitalize } from '@dovenv/core/utils'
import { workspace }  from '@dovenv/theme-pigeonposse'

import CONSTS            from './const'
import {
	getPublicPackageByType,
	getPublicPackageData,
} from './templates'

import type { Config } from '@dovenv/core'
import type { docs }   from '@dovenv/theme-pigeonposse'

type Sidebar = NonNullable<docs.DocsConfig['sidebar']>
type ExtractSidebarArray<T> = T extends ( infer U )[]
	? U[]
	: T extends { [key: string]: infer V }
		? V extends ( infer U )[]
			? U[]
			: never
		: never

type SidebarItems = ExtractSidebarArray<Sidebar>

const {
	TYPE, ICON, ID,
} = CONSTS

const wsInstance = new workspace.Workspace( undefined, { const: { ...CONSTS } as Config['const'] } )
const pkgs       = await wsInstance.getPkgPaths()
const publicPkg  = await getPublicPackageData( pkgs, CONSTS.workspaceDir )

const getSidebarReference = (): SidebarItems => {

	const res: SidebarItems = []
	const grouped           = getPublicPackageByType( publicPkg.data )

	for ( const [ type, items ] of Object.entries( grouped ) ) {

		const group = type === TYPE.lib
			? undefined
			: {
				text : type === TYPE.config
					? 'Others'
					: `${type in ICON ? `${ICON[type as keyof typeof ICON]} ` : ''}${capitalize( type.endsWith( 's' ) ? type : `${type}s` )}`,
				collapsed : true,
				items     : ( [] as SidebarItems ),
			}

		for ( const pkg of Object.values( items ) ) {

			const pkgItems = [
				{
					text : 'Index',
					link : pkg.docs.urlPath.index,
				},
			]
			if ( pkg.docs.urlPath.examples ) pkgItems.push( {
				text : `${ICON.examples} Examples`,
				link : pkg.docs.urlPath.examples,
			} )
			if ( pkg.docs.urlPath.api ) pkgItems.push( {
				text : `${ICON.api} Api`,
				link : pkg.docs.urlPath.api,
			} )

			if ( group ) group.items.push( {
				text      : capitalize( pkg.id ),
				collapsed : true,
				items     : pkgItems,
			} )
			else res.push( {
				text      : `${pkg.icon} ${capitalize( pkg.id === 'create' ? 'create (setup)' : pkg.id === ID.core ? 'library' : pkg.id )}`,
				collapsed : pkg.id !== ID.core,
				items     : pkgItems,
			} )

		}

		res.push( group as SidebarItems[number] )

	}

	return res

}
export const sidebar = [
	{
		text  : 'Introduction',
		items : [
			{
				text : `What is ${CONSTS.pkg.extra.id.toUpperCase()}?`,
				link : publicPkg.urlGuidePath,
			},
		],
	},
	{
		text  : 'Reference',
		items : getSidebarReference(),
	},
]
