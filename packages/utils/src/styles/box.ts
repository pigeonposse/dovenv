import { boxen } from '@visulima/boxen'

export type BoxOptions = NonNullable<Parameters<typeof boxen>[1]>

/**
 * Creates a styled box around the provided text.
 *
 * @param   {string}     text      - The text to display inside the box.
 * @param   {BoxOptions} [options] - Optional configuration options for the box.
 * @returns {string}               - The text with the styled box around it.
 * @see https://www.npmjs.com/package/boxen
 * @example
 * const boxedText = box('This is a boxed text', { padding: 1 });
 * console.log(boxedText);
 */
export const box = ( text: string, options?: BoxOptions ): string => boxen( text, options )
