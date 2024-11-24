import { fetch2string }     from './content'
import { getCharsAndWords } from '../string/count'
import {
	getPaths,
	readFile,
} from './super/main'

type GetCharsAndWordsFromPathsOptions = {
	input : string[]
	opts? : Parameters<typeof getPaths>[1]
}
type GetCharsAndWordsFromUrlOptions = { input: string[] }
type GetCharsAndWordsFromContentOptions = { input: string[] }
type GetCharsAndWordsFromOptions = {
	paths?   : GetCharsAndWordsFromPathsOptions['input']
	url?     : GetCharsAndWordsFromUrlOptions['input']
	content? : GetCharsAndWordsFromContentOptions['input']
	opts?    : { paths?: GetCharsAndWordsFromPathsOptions['opts'] }
}

type GetCharsAndWordsFromResponse = {
	chars : number
	words : number
}

/**
 * Gets the total number of characters and words in all files matching the given glob pattern.
 * @param {GetCharsAndWordsFromPathsOptions} param0 - An object containing the input glob pattern and options.
 * @returns {Promise<{ files: number, chars: number, words: number }>} - An object with properties for the number of files, the total number of characters, and the total number of words.
 * @throws {Error} If there is an error while reading the files.
 */
export const getCountFromPaths = async ( {
	input, opts,
}: GetCharsAndWordsFromPathsOptions,
) => {

	let chars = 0,
		words = 0

	const files = await getPaths( input, {
		onlyFiles : true,
		...( opts || {} ),
	} )

	for ( const file of files ) {

		const fileContent = await readFile( file, 'utf-8' )
		const data        = getCharsAndWords( fileContent )
		chars            += data.chars
		words            += data.words

	}
	return {
		files : files.length,
		chars,
		words,
	}

}

/**
 * Gets the total number of characters and words in all files matching the given glob pattern.
 * @param {GetCharsAndWordsFromPathsOptions} param0 - An object containing the input glob pattern and options.
 * @returns {Promise<GetCharsAndWordsFromResponse>} - An object with the total number of characters and words.
 * @throws {Error} If an error occurs while reading the files.
 * @example const result = await getCharsAndWordsFromPaths({ input: ['*.md'] });
 * console.log(result.chars); // Total characters
 * console.log(result.words); // Total words
 */
export const getCharsAndWordsFromPaths = async ( {
	input, opts,
}: GetCharsAndWordsFromPathsOptions,
): Promise<GetCharsAndWordsFromResponse> => {

	const {
		chars,
		words,
	} = await getCountFromPaths( {
		input,
		opts,
	} )

	return {
		chars,
		words,
	}

}

/**
 * Gets the total number of characters and words from the given URLs.
 * @param {GetCharsAndWordsFromPathsOptions} param0 - An object containing the input URLs.
 * @returns {Promise<GetCharsAndWordsFromResponse>} - An object with the total number of characters and words.
 * @throws {Error} If an error occurs while fetching the URLs.
 * @example const result = await getCharsAndWordsFromUrl({ input: ['https://example.com'] });
 * console.log(result.chars); // Total characters
 * console.log(result.words); // Total words
 */
export const getCharsAndWordsFromUrl = async ( { input }: GetCharsAndWordsFromPathsOptions,
): Promise<GetCharsAndWordsFromResponse> => {

	let chars = 0,
		words     = 0

	for ( const i of input ) {

		const response = await fetch2string( i )
		const data     = getCharsAndWords( response )

		chars += data.chars
		words += data.words

	}
	return {
		chars,
		words,
	}

}

/**
 * Calculates the total number of characters and words from a list of string content.
 * @param {GetCharsAndWordsFromContentOptions} param0 - An object containing the input strings to analyze.
 * @returns {Promise<GetCharsAndWordsFromResponse>} - An object with the total number of characters and words.
 * @example
 * const result = await getCharsAndWordsFromContent({ input: ['Hello world!', 'This is a test.'] });
 * console.log(result.chars); // Total characters
 * console.log(result.words); // Total words
 */
export const getCharsAndWordsFromContent = async ( { input }: GetCharsAndWordsFromContentOptions,
): Promise<GetCharsAndWordsFromResponse> => {

	let chars = 0,
		words = 0

	for ( const i of input ) {

		const data = getCharsAndWords( i )

		chars += data.chars
		words += data.words

	}
	return {
		chars,
		words,
	}

}

/**
 * Gets the total number of characters and words from various sources: glob pattern, URL, or string content.
 * @param {object} options - Options for processing content.
 * @param {string[]} [options.paths] - Glob pattern to search for files.
 * @param {string} [options.url] - URL to fetch content from.
 * @param {string} [options.content] - Direct string content to analyze.
 * @param {GetCharsAndWordsFromOptions['opts']}[options.opts] - Additional options for processing content.
 * @returns {Promise<{ chars: number, words: number }>} - Total characters and words in the content.
 * @throws {Error} If an error occurs while processing.
 * @example
 * const result = await getCharsAndWordsFrom({ pattern: ['*.md'] });
 * console.log(result.chars); // Total characters
 * console.log(result.words); // Total words
 *
 * const resultFromUrl = await getCharsAndWordsFrom({ url: 'https://example.com/file.txt' });
 * console.log(resultFromUrl);
 *
 * const resultFromContent = await getCharsAndWordsFrom({ content: 'Direct string content' });
 * console.log(resultFromContent);
 */
export const getCharsAndWordsFrom = async ( {
	paths,
	url,
	content,
	opts,
}: GetCharsAndWordsFromOptions ) => {

	try {

		const res = {
			chars : 0,
			words : 0,
			paths : {
				chars : 0,
				words : 0,
			},
			url : {
				chars : 0,
				words : 0,
			},
			content : {
				chars : 0,
				words : 0,
			},
		}

		if ( paths ) {

			const data       = await getCharsAndWordsFromPaths( {
				input : paths,
				opts  : opts?.paths,
			} )
			res.chars       += data.chars
			res.words       += data.words
			res.paths.chars += data.chars
			res.paths.words += data.words

		}
		if ( url ) {

			const data     = await getCharsAndWordsFromUrl( { input: url } )
			res.chars     += data.chars
			res.words     += data.words
			res.url.chars += data.chars
			res.url.words += data.words

		}
		if ( content ) {

			const data         = await getCharsAndWordsFromContent( { input: content } )
			res.chars         += data.chars
			res.words         += data.words
			res.content.chars += data.chars
			res.content.words += data.words

		}

		return res

	}
	catch ( error ) {

		console.error( 'Error reading files:', error )
		throw error

	}

}
