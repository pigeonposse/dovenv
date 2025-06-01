
/**
 * Defines the options for filtering empty lines.
 */
export type RemoveEmptyLinesOptions = {
	/**
	 * The maximum number of consecutive empty lines to allow.
	 * - 0: Removes all consecutive empty lines (default).
	 * - 1: Allows a single empty line between content.
	 * - Any number N: Allows up to N empty lines.
	 */
	maxConsecutive? : number
	/**
	 * Whether to remove leading empty lines.
	 *
	 * @default false
	 */
	trimStart?      : boolean
	/**
	 * Whether to remove trailing empty lines.
	 *
	 * @default false
	 */
	trimEnd?        : boolean
}

/**
 * Removes lines from a multiline string based on specified conditions,
 * such as handling consecutive empty lines, leading, and trailing empty lines.
 *
 * @param   {string}                  text      - The input multiline string.
 * @param   {RemoveEmptyLinesOptions} [options] - Optional configuration for removing lines.
 * @returns {string}                            - The string with empty lines processed according to the options.
 */
export const removeEmptyLines = (
	text: string,
	options?: RemoveEmptyLinesOptions,
): string => {

	const mergedOptions: Required<RemoveEmptyLinesOptions> = {
		maxConsecutive : options?.maxConsecutive ?? 0,
		trimStart      : options?.trimStart ?? false,
		trimEnd        : options?.trimEnd ?? false,
	}

	const lines               = text.split( '\n' )
	let consecutiveEmptyCount = 0

	const filteredByConsecutive = lines.filter( line => {

		const isEmpty = line.trim() === ''

		if ( isEmpty ) {

			consecutiveEmptyCount++
			return consecutiveEmptyCount <= mergedOptions.maxConsecutive

		}

		consecutiveEmptyCount = 0
		return true

	} )

	if ( mergedOptions.trimStart )
		while ( filteredByConsecutive[0]?.trim() === '' )
			filteredByConsecutive.shift()

	if ( mergedOptions.trimEnd )
		while ( filteredByConsecutive[filteredByConsecutive.length - 1]?.trim() === '' )
			filteredByConsecutive.pop()

	const finalLines = [ ...filteredByConsecutive ]

	return finalLines.join( '\n' )

}
