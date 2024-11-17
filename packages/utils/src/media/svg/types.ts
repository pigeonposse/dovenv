
import type { Svg2ImgCoreProps } from './core'
import type { Prettify }         from '../../ts/main'
import type {
	AsciifyOptions,
	MediaInput,
} from '../_core/types'
import type { IconDefinition } from '../icons/types'
import type { ImageProps }     from '../types'

type SvgSharedProps =  {
	/**
	 * Input to the media PATH, URL, STRING, BUFFER or IconDefinition (FONTAWESOME).
	 */
	input       : MediaInput | IconDefinition
	/**
	 * Svg options.
	 */
	svgOptions? : Svg2ImgCoreProps
}
export type Svg2ImageProps = Prettify<SvgSharedProps>
export type Svg2AsciiProps = Prettify<SvgSharedProps & Omit<AsciifyOptions, 'input'>>
export type SvgProps = Prettify<SvgSharedProps & Omit<ImageProps, 'input'>>

