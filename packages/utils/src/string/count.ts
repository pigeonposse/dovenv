/**
 * Gets the total number of characters and words in a given string.
 *
 * @param   {string}                           text - The string to analyze.
 * @returns {{ chars: number, words: number }}      - An object containing the total number of characters and words.
 * @example
 * const result = getCharsAndWords("Hello world!");
 * console.log(result.chars); // 12
 * console.log(result.words); // 2
 */
export const getCharsAndWords = ( text: string ): {
	chars : number
	words : number
} => {

	const chars = text.length
	const words = text.split( /\s+/ ).filter( Boolean ).length
	return {
		chars,
		words,
	}

}
