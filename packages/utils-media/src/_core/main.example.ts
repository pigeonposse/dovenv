import { asciifyImg } from './main'
import { readFile }   from '../../sys/main'

const buffer = await readFile( 'docs/public/logo.png' )
const result = await asciifyImg( {
	input : buffer,
	color : true,
	chars : ' #*',

} )
console.log( result )
