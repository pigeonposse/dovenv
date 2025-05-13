/* eslint-disable @stylistic/object-curly-newline */

import {
	getCurrentDir,
	joinPath,
	md2terminal,
	incrementMdHeaders,
	getMD,
	geMDTocString,
	md2html,
	html2terminal,
	line,
	color,
} from '../main'

const title         = ( t: string ) => console.log( `\n\n${line( { title: color.inverse( ` ${t} ` ) } )}\n\n` )
const currDir       = await getCurrentDir( import.meta.url )
const pkgDir        = joinPath( currDir, '..', '..' )
const readmePath    = joinPath( pkgDir, 'README.md' )
const readmeContent = await getMD( readmePath )

title( 'Terminal markdown' )
console.log( await md2terminal(
	readmePath,
	{
		renderer : {
		// @ts-ignore
			image : function ( _href, _title, text ) {

				return text

			},
		},
	},
) )

title( 'md to html' )
console.log( await md2html( readmeContent ) )

title( 'html to terminal' )
console.log( await html2terminal( await md2html( readmeContent ) ) )

title( 'Increment headers' )
const cont = await incrementMdHeaders( readmeContent )
console.log( await md2terminal( cont ), cont )

title( 'Readme toc' )
console.log( await geMDTocString( {
	input    : readmeContent,
	title    : 'Table of contents',
	removeH1 : true,
} ) )

title( 'URL markdown to terminal' )
console.log(
	await md2terminal( 'https://raw.githubusercontent.com/pigeonposse/.github/refs/heads/main/profile/README.md' ),
)
