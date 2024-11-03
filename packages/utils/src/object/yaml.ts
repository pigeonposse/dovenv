import yamlLib from 'js-yaml'

import {
	getFileContent,
	type CommonObj,
} from './_super'

/**
 * Get object from a YAML file.
 * @param   {string}                     path - Path to the JSON file.
 * @returns {Promise<object | object[]>}      - The parsed JSON object.
 * @throws {Error} If there is an error reading the JSON file.
 * @example import { getObjectFromYAMLFile } from "@dovenv/utils"
 *
 * const object = await getObjectFromYAMLFile('/my/file.yaml')
 * console.log( object )
 */
export const getObjectFromYAMLFile = async <Res extends CommonObj = CommonObj>( path: string ) => {

	try {

		const fileContent = await getFileContent( path )
		return await getObjectFromYAMLContent( fileContent ) as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading YAML file ${path}: ${error.message}` )

	}

}

export const getObjectFromYAMLContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	const r = yamlLib.load( content ) as Res
	return r

}
export const yaml = {
	deserialize : getObjectFromYAMLContent,
	serialize   : ( content: object ) => yamlLib.dump( content ),
}
