
import * as ini from '@structium/ini'

import {
	getFileContent,
	type CommonObj,
} from './_super'

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

	return await ini.deserialize<Res>( content )

}

export { ini }

