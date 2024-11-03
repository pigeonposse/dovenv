
import IniLib from 'ini'

import {
	getFileContent,
	type CommonObj,
} from './_super'

const isHTML = ( input: string ): boolean => {

	// Expresión regular para detectar etiquetas HTML
	const htmlTagPattern = /<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/i
	return htmlTagPattern.test( input.trim() )

}

export const getObjectFromINIFile = async <Res extends CommonObj = CommonObj>( path: string ) => {

	try {

		const fileContent = await getFileContent( path )
		return await getObjectFromINIContent( fileContent ) as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading INI file ${path}: ${error.message}` )

	}

}

export const getObjectFromINIContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	const isHTMLContent = isHTML( content )
	if ( isHTMLContent ) throw new Error( 'Content is HTML' )
	return IniLib.parse( content ) as Res

}

const objectToINI = async <I extends CommonObj>( obj: I ): Promise<string> => {

	return IniLib.stringify( obj, { align: true } )

}

export const ini = {
	deserialize : getObjectFromINIContent,
	serialize   : objectToINI,
}

