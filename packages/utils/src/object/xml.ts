
import * as xml from '@structium/xml'

import {
	getFileContent,
	type CommonObj,
} from './_super'

/**
 * Fetches and parses an XML file into a JavaScript object.
 *
 * @template                Res  - The expected return type of the parsed object.
 * @param    {string}       path - The file path of the XML file to be read and parsed.
 * @returns  {Promise<Res>}      - A promise that resolves to the parsed XML as an object.
 * @throws {Error} If there is an error reading or parsing the XML file.
 */
export const getObjectFromXMLFile = async <Res extends CommonObj = CommonObj>( path: string ) => {

	try {

		const fileContent = await getFileContent( path )
		return await getObjectFromXMLContent( fileContent ) as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading XML file ${path}: ${error.message}` )

	}

}

/**
 * Parses an XML content string into a JavaScript object.
 *
 * @template                Res     - The expected return type of the parsed object.
 * @param    {string}       content - The XML content string to be parsed.
 * @returns  {Promise<Res>}         - A promise that resolves to the parsed XML as an object.
 * @throws {Error} If there is an error parsing the XML content.
 */
export const getObjectFromXMLContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	try {

		return xml.deserialize<Res>( content )

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error parsing XML content: ${error.message}` )

	}

}

export { xml }
