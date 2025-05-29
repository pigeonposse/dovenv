import { createBadgeSVG } from './main'

console.log( await createBadgeSVG( {
	label   : 'test',
	message : 'test',
	color   : 'blue',
	style   : 'for-the-badge',

} ) )
