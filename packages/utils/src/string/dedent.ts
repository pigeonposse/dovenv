/**
 * Fork from https://github.com/dmnd/dedent/blob/main/src/types.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
export interface DedentOptions {
	escapeSpecialCharacters? : boolean
	trimWhitespace?          : boolean
}

export interface Dedent {
	( literals: string ): string
	( strings: TemplateStringsArray, ...values: unknown[] ): string
	withOptions : CreateDedent
}

export type CreateDedent = ( options: DedentOptions ) => Dedent

const createDedent = ( options: DedentOptions ) => {

	dedent.withOptions = ( newOptions: DedentOptions ): Dedent =>
		createDedent( {
			...options,
			...newOptions,
		} )

	return dedent

	function dedent( literals: string ): string
	function dedent( strings: TemplateStringsArray, ...values: unknown[] ): string

	function dedent(
		strings: TemplateStringsArray | string,
		...values: unknown[]
	) {

		const raw = typeof strings === 'string' ? [ strings ] : strings.raw
		const {
			escapeSpecialCharacters = Array.isArray( strings ),
			trimWhitespace = true,
		} = options

		// first, perform interpolation
		let result = '',
			mindent: null | number = null

		for ( let i = 0; i < raw.length; i++ ) {

			let next = raw[i]

			if ( escapeSpecialCharacters ) {

				// handle escaped newlines, backticks, and interpolation characters
				next = next
					.replace( /\\\n[ \t]*/g, '' )
					.replace( /\\`/g, '`' )
					.replace( /\\\$/g, '$' )
					.replace( /\\\{/g, '{' )

			}

			result += next

			if ( i < values.length ) {

				result += values[i]

			}

		}

		// now strip indentation
		const lines = result.split( '\n' )

		for ( const l of lines ) {

			const m = l.match( /^(\s+)\S+/ )
			if ( m ) {

				const indent = m[1].length
				if ( !mindent ) {

					// this is the first indented line
					mindent = indent

				}
				else {

					mindent = Math.min( mindent, indent )

				}

			}

		}

		if ( mindent !== null ) {

			const m = mindent // appease TypeScript
			result  = lines
			// https://github.com/typescript-eslint/typescript-eslint/issues/7140

				.map( l => ( l[0] === ' ' || l[0] === '\t' ? l.slice( m ) : l ) )
				.join( '\n' )

		}

		// dedent eats leading and trailing whitespace too
		if ( trimWhitespace ) {

			result = result.trim()

		}

		// handle escaped newlines at the end to ensure they don't get stripped too
		if ( escapeSpecialCharacters ) {

			result = result.replace( /\\n/g, '\n' )

		}

		return result

	}

}

/**
 * A string tag that strips indentation from multi-line strings.
 */
const dedent: Dedent = createDedent( {} )

export { dedent }
