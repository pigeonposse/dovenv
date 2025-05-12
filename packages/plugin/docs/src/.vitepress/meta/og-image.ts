import { truncate }  from '@dovenv/core/utils'
import { Resvg }     from '@resvg/resvg-js'
import { writeFile } from 'node:fs/promises'
import satori        from 'satori'
import { html }      from 'satori-html'

export type OgImageOpts = {
	/** Title for the og image */
	title   : string
	/** Description for the og image */
	desc    : string
	/** Text for the og image */
	text?   : string
	/** Image path for the og image */
	image   : string
	/**
	 * Output path for the og image
	 *
	 * @default './build/og.png'
	 */
	output? : string
	/**
	 * Width for the og image
	 *
	 * @default 1200
	 */
	width?  : number
	/**
	 * Height for the og image
	 *
	 * @default 600
	 */
	height? : number
	/** Colors for the og image */
	color?: {
		primary?   : string
		/** Secondary color for the theme. */
		secondary? : string
		/** Tertiary color for the theme. */
		terciary?  : string
		/** Fourth color for the theme. */
		fourth?    : string
		text?      : string
		bg?        : string
	}
	/**
	 * Border radius for the og image
	 *
	 * @default '20px'
	 */
	radius?     : string
	/**
	 * Google Font family name for the og image
	 *
	 * @default 'Open+Sans'
	 * @see https://fonts.google.com/
	 */
	fontFamily? : string
}

const loadGoogleFont = async ( font: string, weight: number = 400 ) => {

	const url      = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`
	const css      = await ( await fetch( url ) ).text()
	const resource = css.match( /src: url\((.+)\) format\('(opentype|truetype)'\)/ )

	if ( resource ) {

		const response = await fetch( resource[1] )
		if ( response.status == 200 ) {

			return await response.arrayBuffer()

		}

	}

	throw new Error( 'failed to load font data' )

}

export const createOGImage = async ( opts: OgImageOpts ) => {

	const width      = opts.width || 1200
	const height     = opts.height || 600
	const imageWidth = width / 3
	const output     = opts.output || './build/og.png'
	const color      = {
		primary   : opts.color?.primary || '#fff',
		secondary : opts.color?.secondary || '#fff',
		terciary  : opts.color?.terciary || '#fff',
		fourth    : opts.color?.fourth || '#fff',
		text      : opts.color?.text || '#fff',
		bg        : opts.color?.bg || '#000',
	}
	const radius     = opts.radius || '20px'
	const fontFamily = opts.fontFamily || 'Open+Sans'
	const fontWeight = {
		text  : 400,
		desc  : 600,
		title : 700,
	} as const
	const fontSize   = {
		text  : '25px',
		desc  : '35px',
		title : '80px',
	} as const

	const markup = html`<div
  style="
    display: flex;
    justify-content: space-around;
    background-color: ${color.bg};
    color: ${color.text};
    align-items: center;
    flex-direction: row;
    height: 100%;
    width: 100%;
    padding: 60px;
	font-family: ${fontFamily};
    gap: 20px;
	border-radius: ${radius};
  "
>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
    "
  >
    <h1
      style="
        font-size: ${fontSize.title};
		font-weight: ${fontWeight.title};
        margin: 0;
        color: ${color.primary};
      "
    >
    	${truncate( opts.title?.toUpperCase() || '', 50 )}
    </h1>
    <h3 style="font-size: ${fontSize.desc}; opacity: 0.9; margin: 10px 0; font-weight: ${fontWeight.desc}">
   		${truncate( opts.desc || '', 100 )}
    </h3>
	<p style="font-size: ${fontSize.text}; opacity: 0.8; margin: 0; font-weight: ${fontWeight.text}">
		${truncate( opts.text || '', 400 )}
	</p>
  </div>

  <div
    style="
      display: flex;
      position: relative;
      width: ${imageWidth}px;
      height: ${imageWidth}px;
    "
  >
    <div
      style="
		display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        width: ${imageWidth}px;
        height: ${imageWidth}px;
        transform: translate(-50%, -50%);
        background-image: linear-gradient(150deg, ${color.primary}, ${color.secondary}, ${color.terciary}, ${color.fourth});
        opacity: 0.7;
        filter: blur(100px);
      "
    ></div>
    <img
      src="${opts.image}"
      width="${imageWidth}"
      height="${imageWidth}"
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        max-width: ${imageWidth}px;
        max-height: ${imageWidth}px;
        border-radius: ${radius};
        transform: translate(-50%, -50%);
      "
    />
  </div>
</div>
`
	// https://og-playground.vercel.app/?share=rVZfb9owEP8qVqYpnRQgFCht1Pal7bS-bNJWdS99ceIjcXFiy3b4U8R33zkUEgh00jQ_EOfufH9-9_OFlZdIBl7kvRSEXDM-c09CjF0KuFmtNm-EMG6UoMuI-BMBCz_Yyl9LY_lkeScLC4VFtVE0gQ7VsixYbRbTZJpWsjsppEa7T2G1apNkq5hUq1ZQwdPi0UJuUJtgFNC10mVzzzUklssC9VrOa2UGPM1cUv0w_FyL55zZrCWdYAlfac6FK9LQwnQMaN7IQ1HGeJGi9iJUDQhSqiL_vCFar93zdvPiIG2h6bKOSH_n4hS6h9UhRmVefID-Pjzr9XsSmEbW32VRlfqLv0FELsOA5FSnHL3jdteDQTIaX2H_yPb8XgsFV2hkYWHrVAjxO3OIp9x2nKIz4UJ0Kn--s9UIqKIa02seqX0-5jTFfHzBC6C6k2rKOBqf9UchgzQg7xnhZng-vohHTjIcx3ToNgMaXlHyxa8qvv_x_PD9-bqX9RvFD44VP8SKJdKVW4d898pv4EXIncwVwk-Ulq_YAENMJkvBSAwEqOGgd9572aAOpY5FGpzvRbr0gx3oLuUnKQUChwc0dmMKZClLjc1gQOZST6sr9R70uqe2xOohs46RrNGzQ141VEoavr0zIKjlM2h2ZntHhuEe1xt3aqNpE82lUpsfMv8gNI0NUtruhSbESsevUfN2uiVg4gK35LHUDPRPZEzpRkRLf7KWVjX7WTjOYkvyLX8RJTjroPuAuN8vB1n8Ry4fuG5QZ7yvwVuG9x0VsSj1GQ40tTg4-_ZYMDdswoZ0M6Dcum2yCJvH87R52Ojk5sXLrFUm6vWYnEEx6yqegiywiQa6icx7Qqayq4r0pfqE7IF-s0Jcd8FqwNvyYzwhf2fKSa6cZsup-b9ZOV38Pk2XSv_tA860yNj8Lvwjseoe1h8Mt-ou9lojYbPzAk8qh5_xopVXle1FfUw78DZ98KKxe2EQl6kXTagwEHiQy1f-tFTuT8FElMhc9ONm2UMeA_Miq0tYB56lMRpkIITEISWYt_4D

	const svg       = await satori( markup, {
		embedFont : true,
		width,
		height,
		fonts     : await Promise.all( Object.values( fontWeight ).map( async w => ( {
			name   : fontFamily,
			data   : await loadGoogleFont( fontFamily, w ),
			style  : 'normal',
			weight : w,
		} ) ) ),
	} )
	const resvg     = new Resvg( svg, { background: color.bg } )
	const pngData   = resvg.render()
	const pngBuffer = pngData.asPng()

	await writeFile( output, pngBuffer )

}

