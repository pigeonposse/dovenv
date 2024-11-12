
import {
	getFileContent,
	type CommonObj,
} from './_super'
import {
	getObjectFromCSVFile,
	getObjectFromCSVContent,
	csv,
} from './csv'
import {
	getObjectFromINIFile,
	getObjectFromINIContent,
	ini,
} from './ini'
import {
	getObjectFromJSFile,
	getObjectFromJSContent,
} from './js'
import {
	getObjectFromJSONFile,
	getObjectFromJSONContent,
	json,
} from './json'
import {
	getObjectFromTOMLFile,
	getObjectFromTOMLContent,
	toml,
} from './toml'
import {
	getObjectFromXMLFile,
	getObjectFromXMLContent,
	xml,
} from './xml'
import {
	getObjectFromYAMLFile,
	getObjectFromYAMLContent,
	yaml,
} from './yaml'
import { catchError }    from '../error/main'
import { getStringType } from '../string/main'
import { fetch2string }  from '../sys/content'
import {
	existsFile,
	joinPath,
} from '../sys/super/main'

export {
	getObjectFromJSFile,
	getObjectFromJSContent,
	getObjectFromJSONFile,
	getObjectFromJSONContent,
	getObjectFromTOMLFile,
	getObjectFromTOMLContent,
	getObjectFromYAMLFile,
	getObjectFromYAMLContent,
	getObjectFromINIFile,
	getObjectFromINIContent,
	getObjectFromCSVFile,
	getObjectFromCSVContent,
	getObjectFromXMLFile,
	getObjectFromXMLContent,
	xml,
	csv,
	ini,
	json,
	yaml,
	toml,
}

const objectExts = {
	json : 'json',
	yml  : 'yml',
	yaml : 'yaml',
	toml : 'toml',
	js   : 'js',
	mjs  : 'mjs',
	ini  : 'ini',
	xml  : 'xml',
	csv  : 'csv',
}

/**
 * Retrieve an object from a file specified by path.
 * Supports JSON, YAML, TOML, JS, INI, CSV, or XML formats.
 * @param   {string}          path - Path to the file.
 * @returns {Promise<object>}      - The object retrieved from the file.
 * @throws {Error} If the file does not exist, or if the data is not an object.
 * @example import { getObjectFromFile } from "@dovenv/utils"
 *
 * const objectFromJSON = await getObjectFromFile('/my/file.json')
 * const objectFromYAML = await getObjectFromFile('/my/file.yaml')
 * const objectFromTOML = await getObjectFromFile('/my/file.toml')
 * const objectFromINI = await getObjectFromFile('/my/file.ini')
 * console.log(
 *   objectFromJSON,
 *   objectFromYAML,
 *   objectFromTOML,
 *   objectFromINI
 * )
 */
export const getObjectFromFile = async <Res extends CommonObj = CommonObj>( path: string ) => {

	try {

		const exists = await existsFile( path )
		if ( !exists ) throw Error( 'File does not exists' )

		let data

		if ( path.endsWith( '.' + objectExts.json ) )
			data = await getObjectFromJSONFile<Res>( path )
		else if ( path.endsWith( '.' + objectExts.yml ) || path.endsWith( '.' + objectExts.yaml ) )
			data = await getObjectFromYAMLFile<Res>( path )
		else if ( path.endsWith( '.' + objectExts.toml ) )
			data = await getObjectFromTOMLFile<Res>( path )
		else if ( path.endsWith( '.' + objectExts.js ) || path.endsWith( '.' + objectExts.mjs ) )
			data = await getObjectFromJSFile<Res>( path )
		else if ( path.endsWith( '.' + objectExts.ini ) )
			data = await getObjectFromINIFile<Res>( path )
		else if ( path.endsWith( '.' + objectExts.csv ) )
			data = await getObjectFromCSVFile( path ) as Res
		else if ( path.endsWith( '.' + objectExts.xml ) )
			data = await getObjectFromXMLFile<Res>( path )
		else
			throw new Error( 'Unsupported file format. Expected JSON, YAML or TOML.' )

		if ( typeof data !== 'object' || data === null ) throw new Error( 'Data is not an object.' )

		return data

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading file ${path}: ${error.message}` )

	}

}

/**
 * Retrieve an object from a file without checking if is correct file extension.
 * Supports JSON, YAML, TOML, JS, INI, CSV, or XML formats.
 * @param   {string}          path - Path to the file.
 * @returns {Promise<object>}      - The object retrieved from the file.
 * @throws {Error} If there is an error reading the file or if the data is not an object.
 * @example import { getObjectFromNonCheckFile } from "@dovenv/utils"
 *
 * const objectFromFile = await getObjectFromNonCheckFile('/my/file') // without extension
 * console.log(objectFromFile)
 */
export const getObjectFromNonCheckFile = async <Res extends CommonObj = CommonObj>( path: string ) => {

	try {

		const fileContent = await getFileContent( path )

		const data = await getObjectFromContent<Res>( fileContent )
		if ( typeof data !== 'object' || data === null ) throw new Error( 'Data is not an object.' )

		return data

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading file ${path}: ${error.message}` )

	}

}

/**
 * Retrieve an object from a file specified by path and filename.
 * Supports JSON, YAML, TOML, JS, INI, CSV, or XML formats.
 * @param   {string}                       path     - Path to the directory containing the file.
 * @param   {string}                       filename - Name of the file (without extension).
 * @returns { Promise<object | undefined>}          - The object retrieved from the file.
 * @throws {Error} If the file does not exist, or if the data is not an object.
 * @example import { getObjectFromPath } from "@dovenv/utils"
 *
 * const content = await getObjectFromPath('/my/directory', 'my-file-name')
 * console.log( content )
 */
export const getObjectFromPath = async <Res extends CommonObj = CommonObj>( path: string, filename: string ) => {

	try {

		const exts = Object.values( objectExts )
		for ( let index = 0; index < exts.length; index++ ) {

			const ext      = exts[index]
			const filePath = joinPath( path, filename + '.' + ext )
			const exists   = await existsFile( filePath )
			if ( exists ) {

				const data = await getObjectFromFile<Res>( filePath )

				return data

			}

		}

		throw Error( 'Path not exist' )

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading file ${path} with filename ${filename}: ${error.message}` )

	}

}

/**
 * Get object from JSON, YAML, TOML, JS, INI, CSV, or XML string.
 * @param   {string}          data - The string to parse.
 * @returns {object}                   - The parsed object.
 * @throws {Error} If the data is not a valid object.
 * @example import { getObjectFromContent } from "@dovenv/utils"
 *
 * const jsonContent  = '{"name": "super8"}'
 * const yamlContent  = 'name: super8'
 * const tomlContent  = 'name = "super8"'
 * const object1      = await getObjectFromContent( jsonContent )
 * const object2      = await getObjectFromContent( yamlContent )
 * const object3      = await getObjectFromContent( tomlContent )
 *
 * console.log( object1, object2, object3 )
 */
export const getObjectFromContent = async <Res extends CommonObj = CommonObj> ( data: string ): Promise<Res> => {

	// console.log( 'jsonRes' )
	const [ jsonError, jsonRes ] = await catchError( getObjectFromJSONContent<Res>( data ) )
	if ( !jsonError && jsonRes ) return jsonRes
	// console.log( 'yamlRes' )
	const [ yamlError, yamlRes ] = await catchError( getObjectFromYAMLContent<Res>( data ) )
	if ( !yamlError && yamlRes ) return yamlRes
	// console.log( 'tomlRes' )
	const [ tomlError, tomlRes ] = await catchError( getObjectFromTOMLContent<Res>( data ) )
	if ( !tomlError && tomlRes ) return tomlRes
	// console.log( 'JSRes' )
	const [ JSError, JSRes ] = await catchError( getObjectFromJSContent<Res>( data ) )
	if ( !JSError && JSRes ) return JSRes
	// console.log( 'iniRes' )
	const [ iniError, iniRes ] = await catchError( getObjectFromINIContent<Res>( data ) )
	if ( !iniError && iniRes ) return iniRes
	// console.log( 'xmlRes' )
	const [ xmlError, xmlRes ] = await catchError( getObjectFromXMLContent<Res>( data ) )
	if ( !xmlError && xmlRes ) return xmlRes
	// console.log( 'csvRes' )
	const [ csvError, csvRes ] = await catchError( getObjectFromCSVContent( data ) )
	if ( !csvError && csvRes && Array.isArray( csvRes ) ) return csvRes as Res

	throw new Error( 'Cannot parse object from content' )

}

/**
 * Retrieve an object from a URL.
 * Supports JSON, YAML, and TOML formats.
 * @param   {string}          url - URL of the resource.
 * @returns {Promise<object>}     - The object retrieved from the URL.
 * @throws {Error} If there is an error fetching data from the URL or parsing the object.
 * @example import { getObjectFromUrl } from "@dovenv/utils"
 *
 * // from YAML url
 * const objectFromYamlUrl = await getObjectFromUrl( 'https://raw.githubusercontent.com/pigeonposse/super8/main/.pigeonposse.yml' )
 * // from JSON url
 * const objectFromJsonUrl = await getObjectFromUrl( 'https://raw.githubusercontent.com/pigeonposse/clippo/main/package.json')
 *
 * console.log( objectFromYamlUrl, objectFromJsonUrl )
 */
export const getObjectFromUrl = async <Res extends CommonObj = CommonObj>( url: string ) => {

	try {

		const data = await fetch2string( url )
		const res  = getObjectFromContent<Res>( data )

		return res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error getting [${url}] data. ${error.message}` )

	}

}

/**
 * Retrieve an object from either a file specified by path or a URL.
 * Supports JSON, YAML, and TOML formats.
 * @param   {string}          input - Path to a file or URL of the resource.
 * @returns {Promise<object>}       - The object retrieved from the file or URL.
 * @throws {Error} If there is an error fetching data or parsing the object.
 * @example import { getObjectFrom } from "@dovenv/utils"
 *
 * const objectFromYamlUrl = await getObjectFrom( 'https://raw.githubusercontent.com/pigeonposse/super8/main/.pigeonposse.yml' )
 * const objectFromJSON = await getObjectFrom('/my/file.json')
 *
 * console.log( objectFromYamlUrl, objectFromJSON )
 */
export const getObjectFrom = async <Res extends CommonObj = CommonObj>( input: string ): Promise<Res> => {

	try {

		const type = getStringType( input )

		if ( type === 'url' ) {

			const res = await getObjectFromUrl<Res>( input )
			return res

		}
		else if ( type === 'path' ) {

			const res = await getObjectFromFile<Res>( input )
			return res

		}
		else {

			const res = await getObjectFromContent<Res>( input )
			return res

		}

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( error.message )

	}

}
