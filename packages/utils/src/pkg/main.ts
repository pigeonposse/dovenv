import { getObjectFromUrl } from '../object/main'

import type { PackageJSON } from '../ts/main'

type Opts = { version: number | string }
type RegistryObj = {
	'dist-tags' : { latest: string }
	'versions'  : { [key in string]: PackageJSON }
}

export const getPKG = async ( packageName: string, opts?:Opts ) => {

	const res = await getObjectFromUrl<RegistryObj>(
		`https://registry.npmjs.org/${packageName.toLowerCase()}`,
	)

	return res['versions'][
		opts?.version
			? opts.version
			: res['dist-tags']['latest']
	]

}
// export const getPKG = packageJson

export const getPKGVersion = async ( packageName: string ) => {

	const { version } = await getPKG( packageName )
	return version

}
