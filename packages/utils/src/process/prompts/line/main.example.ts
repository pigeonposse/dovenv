import { promptLineGroup } from './main'
import { color }           from '../../../styles/color'

// log.verbose = true
// log.error( 'es un error' )
// log.warn( 'es un warn' )
// log.info( 'es un info' )
// log.debug( 'es un debug' )
// log.fatal( 'es un fatal' )

const results = await promptLineGroup( {
	intro    : color.white( color.bgCyan( ' clippo init ' ) ),
	outro    : 'Succesfully finished 🌈',
	onCancel : p => {

		p.cancel( 'canceled 💔' )
		process.exit( 0 )

	},
	list : p => ( {
		name : async () => await p.text( {
			message      : 'What is your name?',
			placeholder  : 'Angelo',
			defaultValue : 'Angelo',
		} ) as string,
		notes : () => p.note( 'Welcome to clippo test', 'pigeonposse 🐦🌈' ),
		table : () => p.table( {
			value : [
				[
					'0A',
					'0B',
					'0C',
				],
				[
					'1A',
					'1B',
					'1C',
				],
				[
					'2A',
					'2B',
					'2C',
				],
			],
			type : 'error',
		} ),

		columns : () => p.columns( {
			value : [
				{
					version     : '0.0.1',
					name        : 'mod1',
					description : 'some description which happens to be far larger than the max',
				},
				{
					version     : '0.2.0',
					name        : 'module-two',
					description : 'another description larger than the max',
				},
			],
			opts : {
				showHeaders : false,
				minWidth    : 12,
				config      : { description: { maxWidth: 30 } },
			},
		} ),
		form : () => p.typePrompt( {
			type    : 'form',
			message : 'Please provide the following information:',
			choices : [
				{
					name    : 'firstname',
					message : 'First Name',
					// @ts-ignore
					initial : 'Pigeon',
				},
				{
					name    : 'lastname',
					message : 'Last Name',
					initial : 'Posse',
				},
				{
					name    : 'username',
					message : 'GitHub username',
					initial : 'pigeonposse',
				},
			],
		} ),
		nose : () => p.typePrompt( {
			type    : 'scale',
			message : 'Please rate your experience',
			// @ts-ignore
			scale   : [
				{
					name    : '1',
					message : 'Strongly Disagree',
				},
				{
					name    : '2',
					message : 'Disagree',
				},
				{
					name    : '3',
					message : 'Neutral',
				},
				{
					name    : '4',
					message : 'Agree',
				},
				{
					name    : '5',
					message : 'Strongly Agree',
				},
			],
			margin : [
				0,
				0,
				2,
				1,
			],
			choices : [
				{
					name    : 'interface',
					message : 'The website has a friendly interface.',
					initial : 2,
				},
				{
					name    : 'navigation',
					message : 'The website is easy to navigate.',
					initial : 2,
				},
				{
					name    : 'images',
					message : 'The website usually has good images.',
					initial : 2,
				},
				{
					name    : 'upload',
					message : 'The website makes it easy to upload images.',
					initial : 2,
				},
				{
					name    : 'colors',
					message : 'The website has a pleasing color palette.',
					initial : 2,
				},
			],
		} ),
		age   : () => p.number( { message: 'What is your age?' } ),
		color : ( { results } ) => p.multiselect( {
			// @ts-ignore
			message : `What is your favorite color ${results.name}?`,
			options : [
				{
					value : 'red',
					label : 'Red',
				},
				{
					value : 'green',
					label : 'Green',
				},
				{
					value : 'blue',
					label : 'Blue',
				},
			],
		} ),
	} ),
} )

console.log( )
console.log( results )

// const v  = await p.group( { line: () => p.text( { message: 'What is your name?' } ) } )
// const v2 = await promptLine( { list : p => ( {
// 	line : () =>  p.text( { message: 'What is your name?' } ),
// 	form : (  ) => p.typePrompt( 		{
// 		type    : 'form',
// 		message : 'Please provide the following information:',
// 		choices : [
// 			{
// 				name    : 'firstname',
// 				message : 'First Name',
// 				// @ts-ignore
// 				initial : 'Pigeon',
// 			},
// 			{
// 				name    : 'lastname',
// 				message : 'Last Name',
// 				initial : 'Posse',
// 			},
// 			{
// 				name    : 'username',
// 				message : 'GitHub username',
// 				initial : 'pigeonposse',
// 			},
// 		],
// 	} ),
// } ) } )
// console.log( v, v2 )
