import { createBadgeSVG } from '@dovenv/utils'

import { svg2terminal }          from './main'
import { fontAwesomeSolidIcons } from '../icons/main'

const createdInput = await createBadgeSVG( {
	label   : 'Hola',
	message : 'mundo',
	color   : 'blue',
	style   : 'for-the-badge',
} )

const terminalIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>`
const svgColored   = `<svg width="100" height="100"><rect width="100%" height="100%" fill="red" /></svg>`

console.log( await svg2terminal( {
	input      : createdInput,
	svgOptions : { quality: 100 },
} ) )

console.log( await svg2terminal( {
	input      : svgColored,
	svgOptions : { quality: 100 },
} ) )
console.log( await svg2terminal( {
	input      : svgColored,
	svgOptions : {
		quality       : 100,
		transformNode : node => {

			if ( node.children[0].name !== 'rect' ) return node
			node.children[0].attributes.fill = 'blue'
			return node

		},
	},
} ) )
console.log( await svg2terminal( {
	input      : terminalIcon,
	svgOptions : {
		quality : 100,
		resvg   : { background: '#fff' },
	},
} ) )
console.log( await svg2terminal( {
	input        : fontAwesomeSolidIcons.faAnchorLock,
	width        : '80%',
	height   	   : '80%',
	asciiOptions : { chars: '.#*' },
	asciiOutput  : true,
} ) )
