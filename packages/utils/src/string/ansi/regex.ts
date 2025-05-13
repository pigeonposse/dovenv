/**
 * Creates a regular expression to match ANSI escape codes.
 *
 * @param   {object}  options           - Optional configuration object.
 * @param   {boolean} options.onlyFirst - If true, the regex will stop after the first match.
 * @returns {RegExp}                    A regular expression for matching ANSI escape codes.
 *
 *                                      This function generates a regular expression that can be used to identify
 *                                      ANSI escape codes within a string. These codes are often used in terminal
 *                                      emulators to apply text formatting such as colors, styles, and hyperlinks.
 *                                      The regex pattern accommodates various ANSI sequences, including those
 *                                      terminated by BEL, ESC\, or 0x9c.
 * @example
 * ansiRegex().test('\u001B[4mcake\u001B[0m');
 * //=> true
 *
 * ansiRegex().test('cake');
 * //=> false
 *
 * '\u001B[4mcake\u001B[0m'.match(ansiRegex());
 * //=> ['\u001B[4m', '\u001B[0m']
 *
 * '\u001B[4mcake\u001B[0m'.match(ansiRegex({onlyFirst: true}));
 * //=> ['\u001B[4m']
 *
 * '\u001B]8;;https://github.com\u0007click\u001B]8;;\u0007'.match(ansiRegex());
 * //=> ['\u001B]8;;https://github.com\u0007', '\u001B]8;;\u0007']
 */

export const ansiRegex = ( { onlyFirst = false } = {} ) => {

	// Valid string terminator sequences are BEL, ESC\, and 0x9c
	const ST      = '(?:\\u0007|\\u001B\\u005C|\\u009C)'
	const pattern = [ `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${ST})`, '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))' ].join( '|' )

	return new RegExp( pattern, onlyFirst ? undefined : 'g' )

}

