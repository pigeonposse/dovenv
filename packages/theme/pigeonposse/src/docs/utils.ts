import {
	getDirName,
	getObjectFromJSONFile,
	joinPath,
	process,
	existsFile,
	capitalize,
} from '@dovenv/core/utils'

import {
	docsRoute,
	ICON,
	ID,
	TYPE,
	FILE_NAME,
	FILE_NAME_BASE,
} from './const'

import type {
	ObjectValues,
	PackageJSON,
} from '@dovenv/core/utils'

export type PkgData = {
	docsDir      : string
	docsGuideDir : string
	urlGuidePath : string
	url          : string
	name         : string
	packagesPath : string
	data: {
		type    : ObjectValues<typeof TYPE>
		id      : string
		pathID  : string
		title   : string
		icon?   : ObjectValues<typeof ICON>
		name    : string
		data    : PackageJSON
		repoURL : string
		package: {
			relativeDir         : string
			dir                 : string
			srcFile             : string
			packageJsonFile     : string
			tsconfigFile?       : string
			readmeFile          : string
			docsFile?           : string
			examplesConfigFile? : string
			isTs                : boolean
		}
		docs: {
			dir     : string
			urlPath: {
				api?      : string
				examples? : string
				index     : string
			}
			apiFile?      : string
			examplesFile? : string
			indexFile     : string
		}
	}[]
}
export const getPublicPackageData = async ( pkgs: string[], wsDir: string, wsPkg: PackageJSON ): Promise<PkgData> => {

	const docsDir      = joinPath( wsDir, 'docs' )
	const guideDir     = joinPath( docsDir, docsRoute.guide )
	const packagesPath = 'packages'
	const docsUrl      = wsPkg.homepage || '/'
	const name         = wsPkg.extra?.productName || wsPkg.extra.id || wsPkg.name

	return {
		docsDir,
		docsGuideDir : guideDir,
		urlGuidePath : joinPath( '/', docsRoute.guide, '/' ),
		url          : docsUrl,
		name,
		packagesPath,
		data         : ( await Promise.all( pkgs.map( async p => {

			const pkgData = await getObjectFromJSONFile<PackageJSON>( p )
			if ( !pkgData || pkgData.private ) return

			const type = p.includes( TYPE.plugin )
				? TYPE.plugin
				: p.includes( TYPE.theme )
					? TYPE.theme
					: p.includes( TYPE.config )
						? TYPE.config
						: TYPE.lib

			const id = p.split( '/' ).at( -2 ) || process.exit()

			const libName = capitalize( name )

			const title = ( type === TYPE.lib && id !== ID.core
				? `${libName} ${capitalize( id )} Package`
				: type === TYPE.lib
					? libName
					: ( `${capitalize( id )} - ${libName} ${capitalize( type )}` ) )

			const icon =  type === TYPE.lib && ( id in ICON )
				? ICON[id as keyof typeof ICON]
				: type !== TYPE.lib && ( type in ICON )
					? ICON[type]
					: undefined

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

			return {
				type,
				id,
				pathID,
				title,
				icon    : icon,
				name    : pkgData.name || '',
				data    : pkgData,
				// @ts-ignore
				repoURL : joinPath( pkgData.repository?.url, 'tree/main', pkgData?.repository?.directory ),
				package : {
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

		} ) ) ).filter( p => p !== undefined ), // remove undefined
	}

}

export const getPublicPackageByType = ( data: PkgData['data'] ) => {

	type GroupedData = Record<keyof typeof TYPE, typeof data>

	const grouped = data.reduce<GroupedData>( ( acc, item ) => {

		if ( !acc[item.type] ) acc[item.type] = []
		acc[item.type].push( item )
		return acc

	}, {} as GroupedData );

	( Object.keys( grouped ) as Array<keyof typeof TYPE> ).forEach( key => {

		grouped[key] = grouped[key].sort( ( a, b ) => {

			if ( a.type === TYPE.lib && a.id === ID.core ) return -1
			if ( b.type === TYPE.lib && b.id === ID.core ) return 1

			return 0

		} )

	} )

	const {
		config,  ...rest
	} = grouped

	return {
		...rest,
		config,
	}

}
