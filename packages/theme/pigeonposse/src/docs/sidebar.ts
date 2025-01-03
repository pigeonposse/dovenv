import { capitalize } from '@dovenv/core/utils'
import { workspace }  from '@dovenv/theme-banda'

import * as CONSTS       from './const'
import {
	getPublicPackageByType,
	getPublicPackageData,
} from './utils'

import type { PkgData }     from './utils'
import type { Config }      from '@dovenv/core'
import type { PackageJSON } from '@dovenv/core/utils'
import type { docs }        from '@dovenv/theme-banda'

type Sidebar = NonNullable<docs.DocsConfig['sidebar']>
type ExtractSidebarArray<T> = T extends ( infer U )[]
	? U[]
	: T extends { [key: string]: infer V }
		? V extends ( infer U )[]
			? U[]
			: never
		: never

type SidebarItems = ExtractSidebarArray<Sidebar>

type SidebarConfig = { onlyReference: boolean }
const { Workspace } = workspace
const {
	TYPE,
	ICON,
	ID,
} = CONSTS

const getSidebarReferenceConstructor = async ( publicPkg: PkgData ): Promise<SidebarItems> => {

	const res: SidebarItems = []

	const grouped = getPublicPackageByType( publicPkg.data )

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

	return res.filter( d => d !== undefined )

}

/**
 * Generates a sidebar configuration for @dovenv/docs plugin.
 * @param {Config} dovenvConfig - The Dovenv configuration.
 * @param {SidebarConfig} [opts] - The options.
 * @returns {Promise<SidebarItems>} The sidebar configuration.
 */
export const getSidebar = async ( dovenvConfig: Config, opts?: SidebarConfig ): Promise<SidebarItems> => {

	// const config     = { const: { ...CONSTS } as Config['const'] }
	const wsInstance = new Workspace( undefined, dovenvConfig )
	const pkgs       = await wsInstance.getPkgPaths()
	const publicPkg  = await getPublicPackageData(
		pkgs,
		dovenvConfig.const?.workspaceDir as string,
		dovenvConfig.const?.pkg as PackageJSON,
	)

	const reference = {
		text  : 'Reference',
		items : await getSidebarReferenceConstructor( publicPkg ),
	}
	const intro     = !opts?.onlyReference
		?	{
			text  : 'Introduction',
			items : [
				{
					text : `What is ${publicPkg.name.toUpperCase()}?`,
					link : publicPkg.urlGuidePath,
				},
			],
		}
		: undefined
	return [ intro, reference ].filter( d => d !== undefined )

}
