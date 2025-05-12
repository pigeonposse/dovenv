import {
	getPackage,
	getPackageFromName,
	getPackageFromUrl,
	getPackageVersion,
} from '.'

console.time( 'getPackage' )
const dovenvPkg = await getPackage( '@dovenv/core' )
console.timeEnd( 'getPackage' )

console.time( 'getPackageFromName' )
const dovenvPkgName = await getPackageFromName( '@dovenv/core' )
console.timeEnd( 'getPackageFromName' )

console.time( 'getPackageFromUrl' )
const dovenvFormUrl = await getPackageFromUrl( 'https://www.npmjs.com/package/@dovenv/core' )
console.timeEnd( 'getPackageFromUrl' )

console.time( 'getPackageVersion' )
const dovenvVersion = await getPackageVersion( '@dovenv/core' )
console.timeEnd( 'getPackageVersion' )

console.log(
	dovenvPkgName,
	dovenvFormUrl,
	dovenvPkg,
	dovenvVersion,
)
