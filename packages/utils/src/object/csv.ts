
import * as csv from '@structium/csv'

import { getFileContent } from './_super'

import type { CommonObj } from './_super'

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
	options: csv.DeserializeOptions = {},
): Promise<Res> => {

	return await csv.deserialize( content, options ) as Res

}

export { csv }
