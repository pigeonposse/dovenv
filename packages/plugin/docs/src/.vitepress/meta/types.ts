import { TransformContext } from 'vitepress'

import { OgImageOpts }        from './og-image'
import { RequiredDocsConfig } from '../../config/types'

export type Meta = {
	/**
	 * If true, the og|twitter image will be generated from the docs configuration data.
	 *
	 * **Default**: true if does not exist 'public/banner.png'
	 */
	autoImage? : boolean | Partial<Omit<OgImageOpts, 'output'>>
	shared?: {
		/** The title of the shared link */
		title?       : string
		/** A brief description of the content */
		description? : string
		image?       : string
		url?         : string
	}
	og?: {
		/** Title for the Open Graph metadata. */
		title?       : string
		/** Description for the Open Graph metadata. */
		description? : string
		/** Image URL for the Open Graph metadata. */
		image?       : string
		/** URL for the site, used in Open Graph metadata. */
		url?         : string
		/** Type for the Open Graph metadata. */
		type?        : string
		/** Site name for Open Graph metadata. */
		siteName?    : string
	} | false
	twitter?: {
		/** The title of the shared link */
		title?       : string
		/** A brief description of the content */
		description? : string
		image?       : string
		url?         : string
		/** Domain name */
		domain?      : string
		/** The type of Twitter card, such as summary, summary_large_image, or app... */
		card?        : string
		/**
		 * Twitter account associated with the site.
		 *
		 * @example "@pigeonposse_"
		 */
		site?        : string
		/**
		 * The Twitter acoount of the content creator
		 *
		 * @example "@pigeonposse_"
		 */
		creator?     : string
	} | false
	/**
	 * Custom metadata
	 *
	 * @example
	 * ```js
	 * [{ name: 'twitter:label1', content: 'Genre' }]
	 * // Result:
	 * <meta name="twitter:label1" content="Genre">
	 * ```
	 */
	custom? : { [key: string]: string }[]
	onPage? : ( data:{
		context : TransformContext
		config  : RequiredDocsConfig
	} ) => ( Promise<TransformContext['head'] | void> | TransformContext['head'] | void )
}
