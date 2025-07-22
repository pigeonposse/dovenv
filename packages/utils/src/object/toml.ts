import * as toml from '@structium/toml'

import {
	getFileContent,
	type CommonObj,
} from './_super'

/**
 * Get object from a TOML file.
 *
 * @param   {string}                     path - Path to the JSON file.
 * @returns {Promise<object | object[]>}      - The parsed JSON object.
 * @throws {Error} If there is an error reading the JSON file.
 * @example import { getObjectFromTOMLFile } from "@dovenv/utils"
 *
 * const objectFromTOML = await getObjectFromTOMLFile('/my/file.toml')
 * console.log(objectFromTOML)
 */
export const getObjectFromTOMLFile = async <Res extends CommonObj = CommonObj>( path: string ) => {

	try {

		const fileContent = await getFileContent( path )
		return await getObjectFromTOMLContent( fileContent ) as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading TOML file ${path}: ${error.message}` )

	}

}

export const getObjectFromTOMLContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	return await toml.deserialize<Res>( content )

}

export { toml }
