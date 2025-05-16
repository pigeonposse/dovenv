
import figures      from 'figures'
import terminalLink from 'terminal-link'

import { _styledeps } from './_deps'

import type { Fonts } from './types'

/**
 * Export types that can be used from outside.
 *
 */
export { Fonts }

/**
 * Unicode symbols with fallbacks for older terminals.
 *
 * @see https://github.com/sindresorhus/figures/blob/main/index.js
 * @example
 * console.log(
 *   icon.warning,
 *   icon.cross,
 *   icon.arrowDown,
 *   icon.bullet
 * )
 */
export const icon = figures

/**
 * Generates ASCII art text using the specified font.
 *
 * @param   {string}           txt    - The text to render as ASCII art.
 * @param   {Fonts}            [font] - The font to use for rendering. Defaults to 'Standard'.
 * @returns { Promise<string>}        - The ASCII art text.
 * @example
 * const asciiText = await asciiFont('Hello, World!', '3-D');
 * console.log(asciiText);
 */
export const asciiFont = async ( txt: string, font: Fonts = 'Standard' ): Promise<string> => {

	const figlet = await _styledeps.get( 'figlet' )
	return figlet.textSync( txt, {
		font,
		horizontalLayout : 'default',
		verticalLayout   : 'default',
		whitespaceBreak  : true,
	} )

}

/**
 * Creates a clickable hyperlink in the terminal, if supported.
 * If terminal doesn't support clickable links, returns the URL string.
 *
 * @param   {string} text - The text to display as the link.
 * @param   {string} url  - The URL to link to.
 * @returns {string}      - The clickable hyperlink or URL string.
 * @example
 * const linkedText = link('Visit Clippo docs', 'https://clippo.pigeonposse.com');
 * console.log(linkedText);
 */
export const link = ( text: string, url: string ): string => {

	return terminalLink.isSupported ? terminalLink( text, url ) : url

}

