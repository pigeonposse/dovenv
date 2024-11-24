/**
 * Constructs Markdown links or images from an array of links.
 * @param {Array<{ name: string; url: string }>} links - The links to construct.
 * @param {'link' | 'img'} [type] - The type of link to construct ('link' or 'img').
 * @returns {string} - The constructed Markdown string.
 */
export const constructorLinks = (
	links: Array<{
		name : string
		url  : string
	}>,
	type: 'link' | 'img' = 'link',
): string => {

	let res = ''
	links.forEach( ( link, index ) => {

		res += type === 'img' ? imgUrl( link ) : `[${link.name}](${link.url})`
		if ( index !== links.length - 1 ) res += '\n'

	} )
	return res

}

/**
 * Generates a badge image URL from the given parameters.
 * @param {{ name: string; color?: string; url: string; logo?: string; type?: string; }} param0 - The parameters for the badge.
 * @param {string} param0.name - The name of the badge.
 * @param {string} [param0.color] - The color of the badge (default: 'black').
 * @param {string} param0.url - The URL to link the badge to.
 * @param {string} [param0.logo] - The logo to display on the badge (optional).
 * @param {string} [param0.type] - The type of badge (optional).
 * @returns {string} - The Markdown image link for the badge.
 */
export const imgUrl = ( {
	name,
	url,
	color = 'black',
	logo = undefined,
	type = undefined,
}: {
	name   : string
	url    : string
	color? : string
	logo?  : string
	type?  : string
} ): string => {

	if ( !type ) type = `badge/${encodeURIComponent( name )}-${color}?`
	else type = `${type}?color=${color}&`

	const img = `https://img.shields.io/${type}style=for-the-badge${
		logo ? '&logo=' + encodeURIComponent( logo.toLowerCase() ) : ''
	}&logoColor=white`

	return `[![${name}](${img})](${url})`

}
