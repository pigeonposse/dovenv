import type terminalImage from 'terminal-image'

export type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

type ImageToAsciiParams = {
	/**
	 * The pixel width used for aspect ratio.
	 * @default 2
	 */
	pxWidth?      : number
	/** Options for sizing the result image (ASCII art). */
	size_options?: {
		/** Screen size options. */
		screen_size? : {
			width  : number
			height : number
		}
		/** Pixel size options. */
		px_size?     : {
			width  : number
			height : number
		}
		/** If false, the result size will not fit to screen (default: true). */
		fit_screen? : boolean
	}
	/** If false, the pixel objects will not be stringified. */
	stringify?     : boolean
	/** If false, the pixel objects will not be joined together. */
	concat?        : boolean
	/** An array or string containing the characters used for converting the pixels in strings (default: " .,:;i1tfLCG08@"). */
	pixels?        : string[] | string
	/** If true, the pixels will be reversed creating a negative image effect (default: false). */
	reverse?       : boolean
	/**
	 * If true, the output will contain ANSI styles.
	 * @default true
	 */
	colored?       : boolean
	/** If true, the background color will be used for coloring (default: false). */
	bg?            : boolean
	/**
	 * If true, the foreground color will be used for coloring.
	 * @default true
	 */
	fg?            : boolean
	/**
	 * Turn on the white background for transparent pixels.
	 * @default true
	 */
	white_bg?      : boolean
	/** The red, green, and blue values of the custom background color. */
	px_background? : {
		r : number
		g : number
		b : number
	}
	/** Use this to explicitly provide the image type. */
	image_type? : string
}

export type ImageToAsciiOptions = ImageToAsciiParams & {
	size?: {
		height? : number | string
		width?  : number | string
	}
	size_options? : ImageToAsciiParams & { preserve_aspect_ratio?: boolean }
}

export type GraphicInput = string | Readonly<Buffer>

type ImageParams = Readonly<{
	/**
	 * Custom image height.
	 * Can be set as percentage or number of rows of the terminal. It is recommended to use the percentage options.
	 */
	height?              : string | number | undefined
	/**
	 * Custom image width.
	 * Can be set as percentage or number of columns of the terminal. It is recommended to use the percentage options.
	 */
	width?               : string | number | undefined
	/**
	 * If false, the aspect ratio will not be preserved .
	 * @default true
	 */
	preserveAspectRatio? : boolean | undefined
}>

export type ImageOptions = ImageParams & {
	/**
	 * Enable a ascii output.
	 * @default false
	 */
	asciiOutput?  : boolean
	/**
	 * Options for asciiOutput.
	 */
	asciiOptions? : ImageToAsciiParams
}
export type GifOptions = Parameters<typeof terminalImage.gifFile>[1]
