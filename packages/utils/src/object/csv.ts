
import {
	format,
	parseString as parse,
} from 'fast-csv'

import { getFileContent } from './_super'

import type { CommonObj } from './_super'
import type {
	ParserOptionsArgs,
	FormatterOptionsArgs,
} from 'fast-csv'

import { Any } from '@/ts'

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
	options: ParserOptionsArgs = {
		delimiter   : ',',
		ignoreEmpty : true,
		headers     : true,
	},
): Promise<Res> => {

	return new Promise( ( resolve, reject ) => {

		const rows: Any[] = []
		parse( content, options )
			.on( 'data', row => rows.push( row ) )
			.on( 'end', () => resolve( rows as Res ) )
			.on( 'error', err => reject( err ) )

	} )

}

const object2csv = async <I extends CommonCSV>(
	obj: I,
	options: FormatterOptionsArgs<Any, Any> = {
		delimiter : ',',
		headers   : true,
	},
): Promise<string> => {

	return new Promise( ( resolve, reject ) => {

		const result: string[] = []
		const writeStream      = format( {
			...options,
			headers : true,
		} )

		writeStream
			.on( 'data', ( chunk: string ) => result.push( chunk ) )
			.on( 'end', () => resolve( result.join( '' ) ) )
			.on( 'error', err => reject( err ) )

		if ( Array.isArray( obj ) ) obj.forEach( row => writeStream.write( row ) )
		else writeStream.write( obj )

		writeStream.end()

	} )

}

export const csv = {
	deserialize : getObjectFromCSVContent,
	serialize   : object2csv,
}
