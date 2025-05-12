import {
	getPackageRepoUrl,
	getPackageRepoUrlFromName,
	getPackageRepoUrlFromUrl,
} from '.'

console.time( 'getPackage' )
const dovenvPkg = await getPackageRepoUrl( '@dovenv/core' )
console.timeEnd( 'getPackage' )

console.time( 'getPackageFromName' )
const dovenvPkgName = await getPackageRepoUrlFromName( '@dovenv/core' )
console.timeEnd( 'getPackageFromName' )

console.time( 'getPackageFromUrl' )
const dovenvFormUrl = await getPackageRepoUrlFromUrl( 'https://www.npmjs.com/package/@dovenv/core', {
	dir : false,
	pkg : { version: '1.0.0' },
} )
console.timeEnd( 'getPackageFromUrl' )

console.log( {
	dovenvPkg,
	dovenvPkgName,
	dovenvFormUrl,
} )
