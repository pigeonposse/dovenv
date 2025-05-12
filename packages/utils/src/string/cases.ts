/**
 * camelCase → kebab-case
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const camel2Kebab = ( str: string ) =>
	str.replace( /([A-Z])/g, '-$1' ).toLowerCase()

/**
 * camelCase → PascalCase
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const camel2Pascal = ( str: string ) =>
	str.charAt( 0 ).toUpperCase() + str.slice( 1 )

/**
 * camelCase → snake_case
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const camel2Snake = ( str: string ) =>
	str.replace( /([A-Z])/g, '_$1' ).toLowerCase()

/**
 * kebab-case → camelCase
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const kebab2Camel = ( str: string ) =>
	str.replace( /-([a-z])/g, ( _, l ) => l.toUpperCase() )

/**
 * kebab-case → PascalCase
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const kebab2Pascal = ( str: string ) => {

	const camel = kebab2Camel( str )
	return camel2Pascal( camel )

}

/**
 * kebab-case → snake_case
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const kebab2Snake = ( str: string ) =>
	str.replace( /-/g, '_' )

/**
 * PascalCase → camelCase
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const pascal2Camel = ( str: string ) =>
	str.charAt( 0 ).toLowerCase() + str.slice( 1 )

/**
 * PascalCase → kebab-case
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const pascal2Kebab = ( str: string ) => {

	const camel = pascal2Camel( str )
	return camel2Kebab( camel )

}

/**
 * PascalCase → snake_case
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const pascal2Snake = ( str: string ) =>
	str.replace( /([A-Z])/g, '_$1' ).toLowerCase()

/**
 * snake_case → camelCase
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const snake2Camel = ( str: string ) =>
	str.replace( /_([a-z])/g, ( _, l ) => l.toUpperCase() )

/**
 * snake_case → kebab-case
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const snake2Kebab = ( str: string ) =>
	str.replace( /_/g, '-' )

/**
 * snake_case → PascalCase
 *
 * @param   {string} str - The string to convert.
 * @returns {string}     - The converted string.
 */
export const snake2Pascal = ( str: string ) => {

	const camel = snake2Camel( str )
	return camel2Pascal( camel )

}
