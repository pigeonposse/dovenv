import { existsLocalBin } from './main'

const mustbeTrue  = await existsLocalBin( 'gh' )
const mustbeFalse = await existsLocalBin( 'ghh' )
console.log( {
	mustbeTrue,
	mustbeFalse,
} )
