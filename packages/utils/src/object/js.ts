import { pathToFileURL } from 'node:url'

import { validateHomeDir } from '../sys/super/main'

import type { CommonObj } from './_super'

/**
 * Get object from a JavaScript file.
 * @param   {string}                     path - Path to the JavaScript file.
 * @param   {string}                     part - The part of the module to import. Defaults to 'default'.
 * @returns {Promise<object | object[]>}      - The imported object.
 * @throws {Error} If there is an error importing the module.
 * @example import { getObjectFromJSFile } from "@dovenv/utils"
 *
 * const content = await getObjectFromJSFile('/my/file.js')
 * const part = await getObjectFromJSFile('/my/fs.js', 'path')
 * console.log(content, part)
 */
export const getObjectFromJSFile = async <Res extends CommonObj = CommonObj>( path: string, part = 'default' ) => {

	try {

		path             = validateHomeDir( path )
		const modulePath = pathToFileURL( path ).href
		const res        = ( await import( modulePath ) )[part]

		if ( !res ) throw Error( `No [${part}] export found` )
		if ( typeof res !== 'object' ) throw Error( 'Export is not an object' )
		return res as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading JS file ${path}: ${error.message}` )

	}

}

export const getObjectFromJSContent = async <Res extends CommonObj = CommonObj>(
	content: string,
	part: string = 'default', // Permitir especificar qué exportación obtener
): Promise<Res> => {

	// Regex para encontrar la exportación por defecto
	const defaultRegex = /export\s+default\s+({[^]*?});/
	const namedRegex   = new RegExp( `export\\s+(const|let|var|function)\\s+${part}\\s*=\\s*({[^]*?});` )

	let result

	// Buscar exportación por defecto
	const defaultMatch = content.match( defaultRegex )
	if ( defaultMatch && defaultMatch.length > 1 ) {

		// Si se encuentra la exportación por defecto
		result = defaultMatch[1]

	}
	else {

		// Buscar exportación nombrada si no se encuentra el default
		const namedMatch = content.match( namedRegex )
		if ( namedMatch && namedMatch.length > 2 ) {

			// Si se encuentra la exportación nombrada
			result = namedMatch[2]

		}

	}

	if ( !result ) throw new Error( `No export object found for "${part}".` )

	try {

		const evaluatedResult = new Function( `return ${result}` )()

		if ( typeof evaluatedResult !== 'object' || evaluatedResult === null ) {

			throw new Error( 'The export is not a valid object.' )

		}

		return evaluatedResult as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error when loading the object from the Javascript content: ${error.message}` )

	}

}
