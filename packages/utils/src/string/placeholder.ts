/* eslint-disable @stylistic/object-curly-newline */

type ParamFn = ( arg: string ) => Promise<string>
type ParamsValue = string | number | Record<string, unknown> | unknown[] | unknown
type Params = Record<string, ParamsValue>

type Props = {
	/** Content to be replaced */
	content    : string
	/**
	 * Parameters
	 * @example
	 * const params = {
	 *     name: 'Antonio',
	 *     lastName : 'Resines'
	 * }
	 */
	params     : Params
	/**
	 * Transform parameters insde placeholders.
	 * @example
	 * const transform = async ( param: string ) => {
	 *     if ( param === 'url' ) return 'https://pigeonposse.com',
	 *     else if ( param === 'http://pigeonposse.com' ) return 'https://pigeonposse.com'
	 *     return param
	 * }
	 */
	transform? : ParamFn
	/** Options */
	opts?: {
		/**
		 * Throw an error if a placeholder is not found.
		 * @default false
		 */
		throw? : boolean
		/**
		 * Throw an error if a parameter is not found.
		 * @default
		 * {
		 *   prefix : '{{',
		 *   suffix : '}}',
		 * }
		 */
		mark? : {
			prefix : string
			suffix : string
		}
	}
}

/**
 * Replace placeholders in a string with their corresponding values.
 *
 * The function takes a string with placeholders, an object with parameter values,
 * and an optional custom parameter function.
 *
 * The function returns a Promise that resolves to the string with all placeholders
 * replaced.
 * @param {Props} props - Props for the function.
 * @param {Props['content']} props.content - The string with placeholders.
 * @param {Props['params']} props.params - An object with parameter values.
 * @param {Props['transform']} [props.transform] - An optional custom parameter function.
 * @param {Props['opts']} [props.opts] - Options to customize the behavior of the function.
 * @returns {Promise<string>} - A Promise that resolves to the string with all placeholders replaced.
 */
export const replacePlaceholders = async ( props: Props ): Promise<string> => {

	const { content, params, transform, opts } = props
	const { prefix, suffix }                   = opts?.mark || { prefix : '{{',
		suffix : '}}' }
	const escapeRegExp                         = ( v: string ) => v.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' )
	const regex                                = new RegExp(
		`${escapeRegExp( prefix )}\\s*([^}]+?)\\s*${escapeRegExp( suffix )}`,
		'g',
	)

	const getValue = ( obj: Params, path: string ) => {

		const parts = path.split( '.' )
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let result: any = obj
		for ( const part of parts ) {

			if ( result === undefined ) return undefined
			if ( part.includes( '[' ) && part.includes( ']' ) ) {

				const [ arrayName, indexStr ] = part.split( '[' )
				const index                   = parseInt( indexStr.replace( ']', '' ), 10 )
				result                        = result[arrayName]?.[index]

			}
			else {

				result = result[part]

			}

		}
		return result

	}

	const replaceAsync = async ( match: string, key: string ): Promise<string> => {

		// console.log( {
		// 	match,
		// 	key,
		// 	arg,
		// } )
		if ( transform ) {

			const transformed = await transform( key )
			if ( transformed !== key ) return transformed

		}

		const value = getValue( params, key )
		if ( value === undefined ) {

			if ( opts?.throw ) throw new Error( `Placeholder ${key} not found` )
			return match

		}

		return String( value )

	}

	let result    = content
	const matches = [ ...content.matchAll( regex ) ]

	for ( const match of matches ) {

		const [ fullMatch, key ] = match
		const replacement        = await replaceAsync( fullMatch, key )
		result                   = result.replace( fullMatch, replacement )

	}

	return result

}
