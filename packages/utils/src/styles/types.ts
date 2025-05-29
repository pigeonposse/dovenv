import type { Font }      from '@ascii-kit/font'
import type FontArray     from '@ascii-kit/fonts'
import type chalk         from 'chalk'
import type { highlight } from 'cli-highlight'

import { Prettify } from '@/ts'

export type Colors = Prettify<keyof typeof chalk>
export type Color = typeof chalk
export type HighlightOpts = Parameters<typeof highlight>[1]
export type FontName = typeof FontArray[number]
export type FontOptions = NonNullable<Parameters<Font['text']>[1]>

export type GradientColors = string[] | {
	color : string
	pos   : number
}[]
export type GradientOpts = {
	/**
	   The gradient can be generated using RGB or HSV interpolation. HSV usually produces brighter colors. Interpolation can be set to rgb for RGB interpolation, orhsv for HSV interpolation.
	   Defaults to rgb. Case insentitive.
	 */
	interpolation? : 'rgb' | 'hsv'
	/**
	   Used only in the case of HSV interpolation.
	   Because hue can be considered as a circle, there are two ways to go from a color to another color.
	   HsvSpin can be either short or long, depending on if you want to take the shortest or the longest way between two colors.
	   Defaults to short. Case insensitive.
	 */
	hsvSpin?       : 'short' | 'long'
}
