export const objectFilter = <O extends Record<string, unknown>>(
	obj: O,
	func: ( value: O[keyof O], key: keyof O ) => boolean,
) => {

	return Object.fromEntries(
		Object.entries( obj ).filter( ( [ key, value ] ) => func( value as O[keyof O], key as keyof O ) ),
	) as O

}

