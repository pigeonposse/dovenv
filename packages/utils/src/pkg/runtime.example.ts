import {
	getPackageRuntime,
	getPackageRuntimeFromName,
	getPackageRuntimeFromUrl,
} from '.'

console.time( 'getPackage' )
const dovenvPkg = await getPackageRuntime( '@dovenv/core' )
console.timeEnd( 'getPackage' )

console.time( 'getPackageFromName' )
const dovenvPkgName = await getPackageRuntimeFromName( '@dovenv/core' )
console.timeEnd( 'getPackageFromName' )

console.time( 'getPackageFromUrl' )
const dovenvFormUrl = await getPackageRuntimeFromUrl( 'https://www.npmjs.com/package/@dovenv/core', { pkg: { version: '1.0.0' } } )
console.timeEnd( 'getPackageFromUrl' )

console.dir( {
	dovenvPkg,
	dovenvPkgName,
	dovenvFormUrl,
} )
