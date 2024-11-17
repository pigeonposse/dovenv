export type Ascci2ImgOptions = {
	/**
	 * The ASCII string to be converted into an image.
	 * Each line in the string represents a row in the image.
	 */
	input : string

	/**
	 * The width of each character in the image, in pixels.
	 * Defaults to 8 pixels if not provided.
	 * @default 8
	 */
	charWidth? : number

	/**
	 * The height of each character in the image, in pixels.
	 * Defaults to 16 pixels if not provided.
	 * @default 16
	 */
	charHeight? : number
	/**
	 * Color string for the background color of the image.
	 * @default 'transparent'
	 */
	bgColor?    : string
	/**
	 * The path to the font file to be used for rendering the ASCII string.
	 * Can be a custom font file or one of Jimp's predefined fonts.
	 * Defaults to `Jimp.FONT_SANS_16_WHITE` if not provided.
	 * @default Jimp.FONT_SANS_16_WHITE
	 */
	fontPath?   : string
}
