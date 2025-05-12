/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { makeBadge } from 'badge-maker'

import type { Format } from 'badge-maker'

import { joinUrl } from '@/string'

type MdLink = {
	name    : string
	URL     : string
	imgURL? : string
}

/**
 * Creates a Markdown link or image from a name and URL.
 *
 * @param   {string} name     - The name of the link.
 * @param   {string} URL      - The URL of the link.
 * @param   {string} [imgURL] - The URL of an image of the link. If 'img', the function will return an image link.
 * @returns {string}          - The constructed Markdown link or image.
 */
export const createMdLink = ( {
	name, URL, imgURL,
}: MdLink ): string => {

	return imgURL ? `[![${name}](${imgURL})](${URL})` : `[${name}](${URL})`

}

/**
 * Constructs Markdown links or images from an array of links.
 *
 * @param   {Array<MdLink>} links - The links to construct.
 * @returns {string}              - The constructed Markdown string.
 */
export const createMdLinks = (
	links: Array<MdLink>,
): string => {

	let res = ''
	for ( let i = 0; i < links.length; i++ ) {

		res += createMdLink( links[i] )
		if ( i !== links.length - 1 ) res += '\n'

	}
	return res

}

/**
 * Cheate shields.io SVGs.
 *
 * @see https://www.npmjs.com/package/badge-maker
 */
export const createBadgeSVG = makeBadge

type BadgeURL = {
	// general
	path        : string
	color?      : string
	style?      : Format['style']
	host?       : string
	// label
	label?      : string
	labelColor? : string
	// logo
	logo?       : string
	logoColor?  : string
	logoSize?   : string
}

/**
 * Create shields.io URL.
 *
 * @see https://shields.io/badges/
 * @example
 * const badgeURL = createBadgeURL({path: 'badge/any_text-you_like-blue'})
 */
export const createBadgeURL = ( params: BadgeURL ): string => {

	const {
		path,
		style = 'flat',
		host = 'https://img.shields.io',
		...rest
	} = params

	if ( !path ) throw new Error( 'The "path" parameter is required to create a badge URL.' )

	const baseUrl     = joinUrl( host, path )
	const queryParams = new URLSearchParams( { style } )

	for ( const [ key, value ] of Object.entries( rest ) ) {

		if ( value ) queryParams.append( key, value.toString() )

	}
	return `${baseUrl}?${queryParams.toString()}`

}

