import {
	getDirTree,
	getPathsTree,
} from '.'
import { color } from '../../src/styles'

console.log( await getDirTree( {
	input : process.cwd(),
	max   : 1,
	// style : ( {
	// 	name, isFolder, indent, isLast, isFirst,
	// } ) => {

	// 	if ( name == '.git' )
	// 		console.log(  {
	// 			isLast,
	// 			isFirst,
	// 			isFolder,
	// 			name,
	// 			indent,
	// 		} )
	// 	return ''

	// },
} ) )
console.log( color.blue.bold.inverse( ' my-project ' ) + '\n' )
console.log( await getPathsTree( {
	input       : [ '*', 'packages/*/*' ],
	// max         : 2,
	sort        : 'ztoa',
	patternOpts : {
		dot       : false,
		gitignore : true,
		onlyFiles : true,
	},
} ) )
