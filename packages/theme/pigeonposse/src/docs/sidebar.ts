import {
	capitalize,
	joinPath,
} from '@dovenv/core/utils'

import * as CONSTS from './const'
import {
	getEmoji,
	getEmojiList,
} from './emoji'
import {
	getPublicPackageByType,
	getPublicPackageData,
} from './pkg'

import type {
	PkgData,
	SidebarConfig,
	SidebarItems,
} from './types'
import type { CommandUtils } from '@dovenv/core'
import type { PackageJSON }  from '@dovenv/core/utils'

const {
	TYPE,
	ID,
} = CONSTS

const getSidebarReferenceConstructor = async (
	publicPkg: PkgData,
	emojis: ReturnType<typeof getEmojiList>,
): Promise<SidebarItems> => {

	const res: SidebarItems = []

	const grouped = getPublicPackageByType( publicPkg.data )
	// console.log( grouped )
	for ( const [ type, items ] of Object.entries( grouped ) ) {

		const setText = ( v:string, i?:string | false ) => i ? `${i} ${v}` : v

		const group = type === TYPE.lib
			? undefined
			: {
				text : setText(
					type === TYPE.config
						? 'Others'
						: capitalize( type.endsWith( 's' ) ? type : `${type}s` ),
					getEmoji( emojis, type ),
				),
				collapsed : true,
				items     : ( [] as SidebarItems ),
			}

		for ( const pkg of Object.values( items ) ) {

			const pkgItems = [
				{
					text : setText( 'Index', emojis?.getStarted ),
					link : joinPath( pkg.docs.urlPath.index, '/' ),
				},
			]

			if ( pkg.docs.urlPath.examples ) pkgItems.push( {
				text : setText( 'Examples', emojis?.examples ),
				link : pkg.docs.urlPath.examples,
			} )
			if ( pkg.docs.urlPath.api ) pkgItems.push( {
				text : setText( 'API', emojis?.api ),
				link : pkg.docs.urlPath.api,
			} )

			if ( group ) group.items.push( {
				text      : setText( capitalize( pkg.id ), pkg.emojiId ),
				collapsed : true,
				items     : pkgItems,
			} )
			else res.push( {
				text : setText(
					capitalize( pkg.id === 'create' ? 'create (setup)' : pkg.id === ID.core ? 'library' : pkg.id ),
					pkg.id === ID.core ? emojis?.library : pkg.emojiId,
				),
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
 * @param {CommandUtils} utils - The Dovenv configuration.
 * @param {SidebarConfig} [opts] - The options.
 * @returns {Promise<SidebarItems>} The sidebar configuration.
 */
export const getSidebar = async ( {
	utils, opts,
}: {
	utils : CommandUtils
	opts? : SidebarConfig
} ): Promise<SidebarItems> => {

	// const config     = { const: { ...CONSTS } as Config['const'] }
	const emojis = getEmojiList( opts?.emojis )

	const pkgs      = await utils.getPkgPaths()
	const publicPkg = await getPublicPackageData(
		pkgs,
		utils.config?.const?.workspaceDir as string,
		utils.config?.const?.pkg as PackageJSON,
		emojis,
	)

	const reference = {
		text  : 'Reference',
		items : await getSidebarReferenceConstructor( publicPkg, emojis ),
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
