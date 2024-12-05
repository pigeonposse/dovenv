import { qrcode } from '@dovenv/core/utils'

export type QRcodeOpts = { input: string }

export const generateQR = async ( opts: QRcodeOpts ) => {

	const qr = await qrcode( opts.input )
	console.log( qr )

}
