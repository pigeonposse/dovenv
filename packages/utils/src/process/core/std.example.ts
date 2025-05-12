import {
	replaceStd,
	onStd,
} from './std'

const secretOut = onStd( {
	type : 'stdout',
	fn   : ( { data } ) => data.replace( /secret/g, '***' ),
} )
secretOut.start()
process.stdout.write( 'My pass is hiiden: secret\n' )
process.stderr.write( 'is not pass: secret\n' )
secretOut.stop()
process.stdout.write( 'My pass is visible: secret\n' )

const versionOut = replaceStd( {
	type   : 'stdout',
	params : { 'v1.3.4': 'v2.1.9' },
} )

versionOut.start()
process.stdout.write( '1.3.4 is now 2.1.9. Test: v1.3.4\n' )
versionOut.stop()
process.stdout.write( '1.3.4 is still 1.3.4. Test: v1.3.4\n' )
