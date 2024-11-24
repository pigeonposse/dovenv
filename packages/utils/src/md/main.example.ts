/* eslint-disable @stylistic/object-curly-newline */

import {
	getCurrentDir,
	joinPath,
	md2terminal,
	incrementMdHeaders,
	getMD,
	geMDTocString,
	md2html,
} from '../main'

const currDir       = await getCurrentDir( import.meta.url )
const pkgDir        = joinPath( currDir, '..', '..' )
const readmePath    = joinPath( pkgDir, 'README.md' )
const readmeContent = await getMD( readmePath )

console.log( 'Terminal markdown' )
console.log( await md2terminal(
	readmePath,
	{ renderer : {
		// @ts-ignore
		image : function ( _href, _title, text ) {

			return text

		} } },
) )

console.log( 'md to html' )
console.log( await md2html( readmeContent ) )

console.log( 'Increment headers' )
const cont = await incrementMdHeaders( readmeContent )
console.log( await md2terminal( cont ), cont )

console.log( 'Readme toc\n', await geMDTocString( {
	input    : readmeContent,
	title    : 'Table of contents',
	removeH1 : true,
} ) )
