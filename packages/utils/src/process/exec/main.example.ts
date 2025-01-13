import {
	existsLocalBin,
	getLocalNodeBinPath,
	getLocalPkgPath,
} from './main'

const mustbeTrue     = await existsLocalBin( 'gh' )
const mustbeFalse    = await existsLocalBin( 'ghh' )
const figletPath     = await getLocalNodeBinPath( { name: 'figlet' } )
const tsxPath        = await getLocalNodeBinPath( { name: 'tsx' } )
const changesetsPath = getLocalPkgPath( '@changesets/cli' )
console.log( {
	mustbeTrue,
	mustbeFalse,
	figletPath,
	tsxPath,
	changesetsPath,
} )
