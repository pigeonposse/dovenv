export const addExtension = <T extends Record<string, string>, E extends string>( base: T, extension: E ) => {

	return Object.fromEntries(
		Object.entries( base ).map( ( [ key, value ] ) => [ key, `${value}.${extension}` ] ),
	) as { [K in keyof T]: `${T[K]}.${typeof extension}` }

}

export const extractLastTwoPathsSeparately = ( fullPath: string ) => {

	try {

		const parts = fullPath.split( '/' ).filter( Boolean ) // Divide el path en partes
		if ( parts.length < 2 ) return undefined
		return {
			first  : parts[parts.length - 2],
			second : parts[parts.length - 1],
		} // Devuelve los dos últimos niveles como un array

	}
	catch ( _ ) {
		//
	}

}
