import { qrcode } from '.'

try {

	const qrString = await qrcode( 'https://dovenv.pigeonposse.com' )
	console.log( qrString )

}
catch ( error ) {

	console.error( 'Error generating QR code:', error )

}
