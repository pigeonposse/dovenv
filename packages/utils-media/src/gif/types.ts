import type {
	AsciifyOptions,
	AsciiOpts,
	MediaSharedProps,
} from '../_core/types'
import type {
	Prettify,
	animate,
} from '@dovenv/utils'
import type terminalImage from 'terminal-image'

type GifOptions = Parameters<typeof terminalImage.gifFile>[1]

export type GifProps = Prettify<MediaSharedProps & Exclude<GifOptions, undefined> & AsciiOpts>

export type Gif2ImagesProps = Prettify<MediaSharedProps>
export type Gif2AsciiArrayProps = Prettify<MediaSharedProps & Omit<AsciifyOptions, 'input'>>

export type Gif2AsciiProps = Prettify<Gif2AsciiArrayProps & { animate?: Omit<Parameters<typeof animate>[0], 'frames'> }>
