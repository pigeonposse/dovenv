import {
	replaceConsole,
	onConsole,
} from './console'

const secretOut = onConsole( {
	type : 'log',
	fn   : ( { data } ) => data.replace( /secret/g, '***' ),
} )
secretOut.start()
console.log( 'My pass is hiiden: secret' )
console.error( 'is not pass: secret' )
secretOut.stop()
console.log( 'My pass is visible: secret' )

const versionOut = replaceConsole( {
	type   : 'log',
	params : { 'v1.3.4': 'v2.1.9' },
} )

versionOut.start()
console.log( '1.3.4 is now 2.1.9. Test: v1.3.4' )
versionOut.stop()
console.log( '1.3.4 is still 1.3.4. Test: v1.3.4' )
