export type ConvertPropsSuper =  {
	/**
	 * Input patterns.
	 *
	 * Accepts glob patterns, urls, and strings.
	 * @example [
	 *   'https://pigeonposse.com',
	 *   './docs/*.md',
	 *   'Just a simple string'
	 * ]
	 * @example './my/file'
	 * @example 'https://pigeonposse.com'
	 * @example 'my content string data'
	 */
	input   : string[] | string
	/**
	 * Output path
	 */
	output? : string
}

export type ConvertResponse = {
	/**
	 * Id of the path
	 */
	id      : string
	/**
	 * Content of the path
	 */
	content : string
}[]

export type ConvertSuperInterface = { run: ( ) => Promise<ConvertResponse> }
