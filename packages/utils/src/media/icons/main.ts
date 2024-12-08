
import { icon }     from '@fortawesome/fontawesome-svg-core'
import * as brands  from '@fortawesome/free-brands-svg-icons'
import * as regular from '@fortawesome/free-regular-svg-icons'
import * as solid   from '@fortawesome/free-solid-svg-icons'

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export const fontAwesomeAllIcons = {
	regular,
	solid,
	brands,
}
export const fontAwesomeRegularIcons = regular
export const fontAwesomeSolidIcons = solid
export const fontAwesomeBrandsIcons = brands

/**
 * Get the SVG string of a font awesome icon.
 * @param {IconDefinition} iconDefinition
 * The font awesome icon definition.
 * @returns {string | undefined}
 * The SVG string of the icon, or undefined if the icon definition is not found.
 */
export const fa2svg = (
	iconDefinition:  IconDefinition,
): string | undefined => {

	const svgIcon = icon( iconDefinition )
	return svgIcon?.html[0] || undefined

}
