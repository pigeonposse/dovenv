import { createOGImage } from './og-image'

createOGImage( {
	output : 'build/index.png',
	title  : 'dovenv',
	desc   : 'Complex projects should be easier',
	text   : 'Toolkit for make your code workspace easier',
	image  : 'https://dovenv.pigeonposse.com/logo.png',
	color  : {
		primary   : '#3c579d',
		secondary : '#4276b5',
		terciary  : '#347ba4',
		fourth    : '#33a09a',
	},
} )

createOGImage( {
	title : 'dovenv',
	desc  : '@dovenv/lint - Documentation',
	text  : 'Toolkit for make your code workspace easier. Create documentation, add beautiful commits, lint and much more.',

	// title : 'dovenvdov envdovenvdove nvdovenvdovenvdovenv dovenvdovenvdo venvdovenvdovenv',
	// desc  : '@dovenv/lint - Documentation @dovenv/lint - Documentation@dovenv/lint - Documentation@dovenv/lint - Documentation@dovenv/lint - Documentation@dovenv/lint - Documentation',
	// text  : 'Toolkit for make your code workspace easier. Create documentation, add beautiful commits, lint and much more. Toolkit for make your code workspace easier. Create documentation, add beautiful commits, lint and much more. Toolkit for make your code workspace easier. Create documentation, add beautiful commits, lint and much more. Toolkit for make your code workspace easier. Create documentation, add beautiful commits, lint and much more.Toolkit for make your code workspace easier. Create documentation, add beautiful commits, lint and much more.Toolkit for make your code workspace easier. Create documentation, add beautiful commits, lint and much more. Toolkit for make your code workspace easier. Create documentation, add beautiful commits, lint and much more',

	image  : 'https://dovenv.pigeonposse.com/logo.png',
	output : 'build/docs.png',
	color  : {
		primary   : '#3c579d',
		secondary : '#4276b5',
		terciary  : '#347ba4',
		fourth    : '#33a09a',
		bg        : '#000000',
	},
} )
