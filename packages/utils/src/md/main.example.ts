import {
	getCurrentDir,
	joinPath,
	md2terminal,
} from '../main'

const currDir = await getCurrentDir( import.meta.url )
const pkgDir  = joinPath( currDir, '..', '..' )
console.log( await md2terminal( joinPath( pkgDir, 'README.md' ), { renderer : {
	// @ts-ignore
	image : function ( href, title, text ) {

		return text
		// return svg2terminal({
		// 	input: href,
		// 	svgOptions: { quality: 100, format: 'jpeg', resvg: { textRendering: 2 } },
		// 	width: '30%',
		// 	height: '30%'
		//   }).then(result => {
		// 	// Aquí puedes manejar el resultado de la promesa
		// 	return result;
		//   }).catch(error => {
		// 	// Manejo de errores si la promesa falla
		// 	console.error('Error processing SVG:', error);
		//   });

	} } } ) )
