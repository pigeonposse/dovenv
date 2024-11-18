/* eslint-disable camelcase */
import { parse }     from 'csv-parse'
import { stringify } from 'csv-stringify/sync'

import { getFileContent } from './_super'

import type { CommonObj }                   from './_super'
import type { Options as ParseOptions }     from 'csv-parse'
import type { Options as StringifyOptions } from 'csv-stringify'

type CommonCSV = CommonObj
export const getObjectFromCSVFile = async <Res extends CommonCSV = CommonCSV>( path: string ) => {

	try {

		const fileContent = await getFileContent( path )
		return await getObjectFromCSVContent( fileContent ) as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading CSV file ${path}: ${error.message}` )

	}

}

export const getObjectFromCSVContent = async <Res extends CommonCSV = CommonCSV>(
	content: string,
	options: ParseOptions = {
		delimiter        : ',',
		columns          : true,
		skip_empty_lines : true,
	},
): Promise<Res> => {

	return new Promise( ( resolve, reject ) => {

		parse( content, options, ( err, output ) => {

			if ( err ) reject( err )
			else resolve( output as Res )

		} )

	} )

}

const object2csv = async <I extends CommonCSV>( obj: I, options?: StringifyOptions ): Promise<string> => {

	if ( Array.isArray( obj ) ) return stringify( obj, {
		header : true,
		...options,
	} )
	// @ts-ignore
	return stringify( obj, {
		header : true,
		...options,
	} )

}

export const csv = {
	deserialize : getObjectFromCSVContent,
	serialize   : object2csv,
}
