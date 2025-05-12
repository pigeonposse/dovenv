import { readFile } from '@dovenv/utils'

import { asciifyImg } from './main'

const buffer = await readFile( 'docs/public/logo.png' )
const result = await asciifyImg( {
	input : buffer,
	color : true,
	chars : ' #*',

} )
console.log( result )
