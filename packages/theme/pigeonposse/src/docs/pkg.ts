import {
	getDirName,
	getObjectFromJSONFile,
	joinPath,
	existsFile,
	capitalize,
} from '@dovenv/core/utils'

import { extractLastTwoPathsSeparately } from './_utils'
import {
	docsRoute,
	ID,
	TYPE,
	FILE_NAME,
	FILE_NAME_BASE,
} from './const'
import {
	getEmoji,
	type getEmojiList,
} from './emoji'

import type {
	PkgData,
	PkgType,
} from './types'
import type { PackageJSON } from '@dovenv/core/utils'

export const getPublicPackageData = async (
	pkgs: string[],
	wsDir: string,
	wsPkg: PackageJSON,
	emojis?:ReturnType<typeof getEmojiList>,
): Promise<PkgData> => {

	const docsDir      = joinPath( wsDir, 'docs' )
	const guideDir     = joinPath( docsDir, docsRoute.guide )
	const packagesPath = 'packages'
	const docsUrl      = wsPkg.extra?.docsURL || wsPkg.extra?.docsUrl || wsPkg.homepage || '/'
	const name         = wsPkg.extra?.productName || wsPkg.extra.id || wsPkg.name

	return {
		docsDir,
		docsPublicDir : joinPath( docsDir, 'public' ),
		docsGuideDir  : guideDir,
		urlGuidePath  : joinPath( '/', docsRoute.guide, '/' ),
		url           : docsUrl,
		name,
		packagesPath,
		data          : ( await Promise.all( pkgs.map( async p => {

			const pkgData = await getObjectFromJSONFile<PackageJSON>( p )
			if ( !pkgData || pkgData.private ) return
			const extract = extractLastTwoPathsSeparately( getDirName( p ) )
			if ( !extract ) throw new Error( `Unexpected error extracting last two paths separately from "${p}"` )

			const parentDir = extract.first as PkgType
			const id        = extract.second

			const type = Object.values( TYPE ).includes( parentDir )
				? parentDir
				: TYPE.lib

			const libName = capitalize( name )

			const title = ( type === TYPE.lib && id !== ID.core
				? `${libName} ${capitalize( id )} Package`
				: type === TYPE.lib
					? libName
					: ( `${capitalize( id )} - ${libName} ${capitalize( type )}` ) )

			const pathID = type !== TYPE.lib ? ( `${type}/${id}` ) : id

			const dir            = getDirName( p )
			const srcTs          = joinPath( dir, 'src', 'main.ts' )
			const srcJs          = joinPath( dir, 'src', 'main.js' )
			const tsconfigPath   = joinPath( dir, 'tsconfig.json' )
			const readmePath     = joinPath( dir, FILE_NAME.README )
			const docsDir        = joinPath( guideDir, pathID )
			const docsPath       = joinPath( '/', docsRoute.guide, pathID )
			const apiPath        = joinPath( docsDir, FILE_NAME.API )
			const examplePath    = joinPath( docsDir, FILE_NAME.EXAMPLES )
			const indexPath      = joinPath( docsDir, FILE_NAME.INDEX )
			const examplesFile   = joinPath( dir, 'examples', 'info.yml' )
			const docsFile       = joinPath( dir, 'docs', FILE_NAME.INDEX )
			const isTs           = await existsFile( srcTs )
			const existsExamples = await existsFile( examplesFile )
			const existsDocs     = await existsFile( docsFile )
			const src            = isTs ? srcTs : srcJs
			const existsApi      = type == 'config' && !isTs ? false : true

			// @ts-ignore
			const repo = joinPath( pkgData.repository?.url, 'tree/main', pkgData?.repository?.directory )

			const res: PkgData['data'][number] = {
				type,
				id,
				pathID,
				title,
				emojiId   : getEmoji( emojis, id ),
				emojiType : getEmoji( emojis, type ),
				name      : pkgData.name || '',
				data      : pkgData,
				repoURL   : repo,
				package   : {
					relativeDir        : joinPath( `${packagesPath}/${pathID}` ),
					dir,
					srcFile            : src,
					packageJsonFile    : p,
					tsconfigFile       : isTs ? tsconfigPath : undefined,
					readmeFile         : readmePath,
					docsFile           : existsDocs ? docsFile : undefined,
					examplesConfigFile : existsExamples ? examplesFile : undefined,
					isTs,
				},
				docs : {
					dir     : docsDir,
					urlPath : {
						api      : existsApi ? joinPath( docsPath, FILE_NAME_BASE.API ) : undefined,
						examples : existsExamples ? joinPath( docsPath, FILE_NAME_BASE.EXAMPLES ) : undefined,
						index    : docsPath,
					},
					apiFile      : existsApi ? apiPath : undefined,
					examplesFile : existsExamples ? examplePath : undefined,
					indexFile    : indexPath,
				},
			}
			return res

		} ) ) ).filter( p => p !== undefined ), // remove undefined
	}

}
type Lib = typeof TYPE['lib']
type GroupedData = { [key in ( PkgType )]?: PkgData['data'] } & { [key in Lib]: PkgData['data'] }

export const getPublicPackageByType = ( data: PkgData['data'] ): GroupedData => {

	const grouped = data.reduce<GroupedData>( ( acc, item ) => {

		if ( !acc[item.type] ) acc[item.type] = []
		acc[item.type]?.push( item )
		return acc

	}, {} as GroupedData );

	( Object.keys( grouped ) as Array<PkgType> ).forEach( key => {

		const group = grouped[key]
		if ( group ) {

			grouped[key] = group.sort( ( a, b ) => {

				if ( a.type === TYPE.lib && a.id === ID.core ) return -1
				if ( b.type === TYPE.lib && b.id === ID.core ) return 1
				return 0

			} )

		}

	} )

	return grouped

}
