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

		return parse( content ) as Res

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error parsing PLAIN content: ${error.message}` )

	}

}

const convertStringToNumber = ( input: string ) => {

	const number = Number( input )
	return isNaN( number ) ? input : number

}
// fork from: https://www.npmjs.com/package/dotenv?activeTab=code
const parse = ( src: string ) => {

	const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg
	const obj  = {}

	let match, lines = src.toString()

	lines = lines.replace( /\r\n?/mg, '\n' )

	while ( ( match = LINE.exec( lines ) ) != null ) {

		const key = match[1]
		let value = ( match[2] || '' )

		value = value.trim()

		const maybeQuote = value[0]

		value = value.replace( /^(['"`])([\s\S]*)\1$/mg, '$2' )

		if ( maybeQuote === '"' ) {

			value = value.replace( /\\n/g, '\n' )
			value = value.replace( /\\r/g, '\r' )

		}

		// @ts-ignore
		obj[key] = convertStringToNumber( value )

	}

	return obj

}
