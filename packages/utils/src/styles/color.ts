import {
	rgbToHex,
	rgbToHsl,
	rgbToCIELab,
	rgbToXyz,
	xyzToCIELab,
	hslToRgb,
	hexToRgb,
} from '@vibrant/color'
import chalk                         from 'chalk'
import chromaJS                      from 'chroma-js'
import { highlight as highlightCli } from 'cli-highlight'
import gradientString                from 'gradient-string'

import type {
	GradientColors,
	GradientOpts,
	HighlightOpts,
} from './types'
import type { Color } from './types'

/**
 * Export types that can be used from outside.
 *
 */
export {
	GradientColors,
	GradientOpts,
	HighlightOpts,
}

export const chroma: typeof chromaJS = chromaJS

export const colorConversion = {
	rgb2hex    : rgbToHex,
	rgb2CIELab : rgbToCIELab,
	rgb2sl     : rgbToHsl,
	rgb2xyz    : rgbToXyz,
	xyz2CIELab : xyzToCIELab,
	hslToRgb   : hslToRgb,
	hex2rgb    : hexToRgb,
}

/**
 * Highlights the given code using CLI highlighting.
 *
 * @param   {string}        code            - The code to highlight.
 * @param   {HighlightOpts} [opts]          - Optional options for highlighting.
 * @param   {string}        [opts.language] - The language of the code to highlight. Defaults to 'auto'.
 * @param   {string}        [opts.theme]    - The theme to use for highlighting. Defaults to 'github'.
 * @returns {string}                        - The highlighted code.
 * @example
 * const code = `
 * function greet(name) {
 *     return 'Hello, ' + name + '!';
 * }
 * console.log(greet('World'));
 * `;
 *
 * const highlightedCode = highlight(code, { language: 'javascript' });
 * console.log(highlightedCode);
 */
export const highlight = ( code: string, opts?: HighlightOpts ): string =>
	highlightCli( code, opts )

/**
 * Provides colors for terminal output.
 *
 * @type {object}
 * @example
 * console.log(color.green('This text is green'));
 */
export const color: Color = chalk

/**
 * Generates a gradient string with the specified colors.
 *
 * @param   {string}         txt    - The text to apply the gradient to.
 * @param   {GradientColors} colors - An array of color names or hex values.
 * @param   {GradientOpts}   [opts] - Custom opts.
 * @returns {string}                - The text with the applied gradient.
 * @example
 * // Example usage:
 * const gradientText = gradient('Gradient Text', ['red', 'yellow', 'green']);
 * console.log(gradientText);
 */
export const gradient = ( txt: string, colors: GradientColors, opts?: GradientOpts ) => {

	return gradientString( colors, opts ).multiline( txt )

}
