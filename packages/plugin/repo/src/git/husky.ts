import { execModulePath } from '@dovenv/utils'

/* eslint-disable @stylistic/object-curly-newline */
export type HuskyConfig = {
	/**
	 * The path to the .husky directory
	 * @default '.dovenv/.husky'
	 */
	path : string
}
export const runHusky = async ( conf?: HuskyConfig ) => {

	await execModulePath( { currentPath : import.meta.url,
		moduleEntry : 'husky',
		modulePath  : [ 'bin.js' ],
		args        : [ conf?.path ?? '.dovenv/.husky' ],
	} )
	console.log( '' ) // for make sure it's on a new line

}
