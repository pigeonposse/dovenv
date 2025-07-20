import * as envConfig from '@structium/env'

import {
	getFileContent,
	type CommonObj,
} from './_super'

export const getObjectFromPlainFile = async <Res extends CommonObj = CommonObj>( path: string ) => {

	try {

		const fileContent = await getFileContent( path )
		return await getObjectFromPlainContent( fileContent ) as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error reading PLAIN file ${path}: ${error.message}` )

	}

}

export const getObjectFromPlainContent = async <Res extends CommonObj = CommonObj>( content: string ) => {

	try {

		return await envConfig.deserialize( content ) as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error parsing PLAIN content: ${error.message}` )

	}

}

