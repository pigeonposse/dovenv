
import type {
	AsciifyOptions,
	AsciiOpts,
	MediaSharedProps,
} from '../_core/types'

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
	 *
	 * @default true
	 */
	preserveAspectRatio? : boolean | undefined
}>

export type ImageProps = MediaSharedProps & ImageParams & AsciiOpts

export type Image2AsciiProps = MediaSharedProps & AsciifyOptions
