import { qrcode } from '@dovenv/core/utils'

import { Core } from './core'

type QRcodeOptsValue = {
	input : string
	/**
	 * QR size.
	 *
	 * @default 'medium'
	 */
	size? : 'medium' | 'large'
}
export type QRcodeOpts = { [k: string]: QRcodeOptsValue }

export class QRcode extends Core<QRcodeOpts> {

	async exec( conf: QRcodeOptsValue ) {

		const {
			input, size,
		} = conf

		const qr = await qrcode( input, { small: size !== 'large' } )

		console.log( )
		console.log( qr )
		console.log( )

	}

	async run( pattern?: string[] ) {

		return await this.execFn( {
			pattern,
			desc : 'Generate QR',
			fn   : d => this.exec( d ),
		} )

	}

}
