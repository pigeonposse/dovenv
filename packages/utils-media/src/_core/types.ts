/* eslint-disable @stylistic/object-curly-newline */
import type { Prettify } from '@dovenv/utils'

export type MediaInput = string | Buffer

export type AsciifyOptions = {
	/**
	 * Input of the image
	 */
	input    : Buffer
	/**
	 * Defines if the output should be colored (`true`) or black and white (`false`)
	 * @default `true`
	 */
	color?   : boolean
	/**
	 * The fit to resize the image to:
	 * • `box` - Resize the image such that it fits inside a bounding box defined by the specified width and height. Maintains aspect ratio.
	 * • `width` - Resize the image by scaling the width to the specified width. Maintains aspect ratio.
	 * • `height` - Resize the image by scaling the height to the specified height. Maintains aspect ratio.
	 * • `original` - Doesn't resize the image.
	 * • `none` - Scales the width and height to the specified values, ignoring original aspect ratio.
	 * @default `box`
	 */
	fit?     : 'box' | 'width' | 'height' | 'original' | 'none'
	/**
	 * The width to resize the image to. Use a percentage to set the image width to x% of the terminal window width.
	 * @default `100%`
	 */
	width?   : number | string
	/**
	 * The height to resize the image to. Use a percentage to set the image width to x% of the terminal window height.
	 * @default `100%`
	 */
	height?  : number | string
	/**
	 * Since a monospace character is taller than it is wide, this property defines the integer approximation of the ratio of the width to height.
	 *
	 * You probably don't need to change this.
	 * @default `2`
	 */
	c_ratio? : number
	/**
	 * The characters to use for the asciified image.
	 * @default ` .,:;i1tfLCG08@`
	 */
	chars?   : string
}

export type AsciiOpts = & {
	/**
	 * Enable a ascii output.
	 * @default false
	 */
	asciiOutput?  : boolean
	/**
	 * Options for asciiOutput.
	 */
	asciiOptions? : Prettify<Omit<AsciifyOptions, 'input' | 'width' | 'height'>>
}

export type MediaSharedProps = {
	/**
	 * Input to the media PATH, URL, STRING or BUFFER.
	 */
	input : MediaInput
}
