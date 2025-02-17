import {
	parse,
	stringify,
} from 'svgson'

export type * as Svg from 'svgson'

export const svg = {
	deserialize : parse,
	serialize   : stringify,
}
