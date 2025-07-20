import type {
	table,
	box,
} from 'creatium/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any

type CoreStyleResponse = {
	table : NonNullable<Parameters<typeof table>[1]>
	box   : NonNullable<Parameters<typeof box>[1]>
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
	},
	table : { chars : {
		'top'          : '',
		'top-mid'      : '',
		'top-left'     : '',
		'top-right'    : '',
		'bottom'       : '',
		'bottom-mid'   : '',
		'bottom-left'  : '',
		'bottom-right' : '',
		'left'         : '',
		'left-mid'     : '',
		'mid'          : '',
		'mid-mid'      : '',
		'right'        : '',
		'right-mid'    : '',
		'middle'       : '',
	} },
} )
