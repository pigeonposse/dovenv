
import figures      from 'figures'
import terminalLink from 'terminal-link'

import type {
	FontName,
	FontOptions,
} from './types'

import { LazyLoader } from '@/sys/loader'

export const _styledeps = new LazyLoader( { font: async () => ( await import( '@ascii-kit/font' ) ).Font } )

/**
 * Export types that can be used from outside.
 *
 */
export { FontName }

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
 * @param   {string}           txt      - The text to render as ASCII art.
 * @param   {string}           fontData - The font to use for rendering. Defaults to 'Standard'.
 * @param   {FontOptions}      [opts]   - Optional parameters for font rendering.
 * @returns { Promise<string>}          - The ASCII art text.
 * @example
 * import font_three_d from '@ascii-kit/font-3d';
 * const asciiText = await renderAsciiFont('Hello, World!', font_three_d);
 * console.log(asciiText);
 */
export const renderAsciiFont = async ( txt: string, fontData: string, opts?: FontOptions ): Promise<string> => {

	const Font = await _styledeps.get( 'font' )
	const font = new Font( fontData )
	return await font.text( txt, {
		horizontalLayout : 'default',
		verticalLayout   : 'default',
		whitespaceBreak  : true,
		...opts || {},
	} )

}

/**
 * Fetches and generates ASCII art text using the specified font name.
 *
 * @param   {string}          txt      - The text to render as ASCII art.
 * @param   {FontName}        fontName - The name of the font to use for rendering.
 * @param   {FontOptions}     [opts]   - Optional parameters for font rendering.
 * @returns {Promise<string>}          - The ASCII art text.
 * @example
 * const asciiText = await asciiFont('Hello, World!', '3-d');
 * console.log(asciiText);
 */

export const asciiFont = async ( txt: string, fontName: FontName, opts?: FontOptions ): Promise<string> => {

	const res = await fetch( `https://unpkg.com/@ascii-kit/fonts-flf/dist/${fontName}.flf` )
	if ( !res.ok ) throw new Error( `Error getting file: ${res.statusText}` )
	const data =  await res.text()

	return await renderAsciiFont( txt, data, opts )

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

