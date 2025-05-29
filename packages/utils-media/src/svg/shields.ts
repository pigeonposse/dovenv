import { LazyLoader } from '@dovenv/utils'
import { Format }     from 'badge-maker'

const loader = new LazyLoader( { 'badge-maker': async () => ( await import( 'badge-maker' ) ).makeBadge } )

/**
 * Cheate shields.io SVGs.
 *
 * @param   {Format}          data - The format of the badge.
 * @returns {Promise<string>}      The SVG code.
 * @see https://www.npmjs.com/package/badge-maker
 */
export const createBadgeSVG = async ( data: Format ) =>
	( await loader.get( 'badge-maker' ) )( data )
