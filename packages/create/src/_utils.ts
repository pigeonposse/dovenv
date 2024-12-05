import type { style } from 'creatium'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any
type Style = typeof style
type CoreStyleResponse = {
	table : NonNullable<Parameters<Style['table']>[1]>
	box   : NonNullable<Parameters<Style['box']>[1]>
}
export const mapObject = <T extends Record<string, Any>, R>(
	obj: T,
	mapper: ( value: T[keyof T], key: keyof T ) => R,
): Record<keyof T, R> => {

	return Object.fromEntries(
		Object.entries( obj ).map( ( [ key, value ] ) => [ key, mapper( value, key as keyof T ) ] ),
	) as Record<keyof T, R>

}

export const getProjectNameInPascalCase = ( input: string ): string => {

	const lastPart = input.split( '/' ).pop() || input

	const pascalCase = lastPart
		.split( /[_-]/ )
		.map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ).toLowerCase() )
		.join( '' )

	return pascalCase.charAt( 0 ).toUpperCase() + pascalCase.slice( 1 )

}
export const getCoreStyleOpts = (): CoreStyleResponse => ( {
	box : {
		padding     : 0,
		borderStyle : 'none',
		dimBorder   : true,
	},
	table : {
		drawHorizontalLine : () => false,
		drawVerticalLine   : () => false,
	},
} )
