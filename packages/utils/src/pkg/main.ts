import packageJson from 'package-json'

import type { Options } from 'package-json'

export const getPKG = packageJson

export const getPKGVersion = async ( packageName: string, options?: Options ) => {

	const { version } = await packageJson( packageName.toLowerCase(), options )
	return version

}
