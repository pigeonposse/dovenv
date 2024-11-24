import {
	getDirTree,
	getPathsTree,
} from './main'

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

console.log(
	await getPathsTree( {
		input       : [ '*', 'packages/*/*' ],
		name        : 'my-project',
		// max         : 2,
		sort        : 'ztoa',
		patternOpts : {
			dot       : false,
			gitignore : true,
			onlyFiles : true,
		},
	} ),
)
