// import { color }      from '@dovenv/utils'
// import { setTimeout } from 'timers/promises'

// import { promptLine } from './main'
// import { Logger }     from '../../../logger/src/main'
// import { tasks }      from '../main'

// const log = new Logger( {
// 	name       : 'test-clippo',
// 	outputFile : './clipo-log',
// 	screenlog  : true,
// } )

// // log.verbose = true
// // log.error( 'es un error' )
// // log.warn( 'es un warn' )
// // log.info( 'es un info' )
// // log.debug( 'es un debug' )
// // log.fatal( 'es un fatal' )

// const results = await promptLine( {
// 	intro    : color.white( color.bgCyan( ' clippo init ' ) ),
// 	outro    : 'Succesfully finished 🌈',
// 	onCancel : p => {

// 		p.cancel( 'canceled 💔' )
// 		process.exit( 0 )

// 	},
// 	list : async p => ( {
// 		image : async () => p.image( 'https://avatars.githubusercontent.com/u/111685953', {
// 			width  : 40,
// 			height : 40,
// 		} ),
// 		name : () => p.text( {
// 			message      : 'What is your name?',
// 			placeholder  : 'Angelo',
// 			defaultValue : 'Angelo',
// 		} ),
// 		notes : () => p.note( 'Welcome to clippo test', 'pigeonposse 🐦🌈' ),
// 		table : () => p.table( [
// 			[
// 				'0A',
// 				'0B',
// 				'0C',
// 			],
// 			[
// 				'1A',
// 				'1B',
// 				'1C',
// 			],
// 			[
// 				'2A',
// 				'2B',
// 				'2C',
// 			],
// 		] ),
// 		columns : () => p.columns( [
// 			{
// 				version     : '0.0.1',
// 				name        : 'mod1',
// 				description : 'some description which happens to be far larger than the max',
// 			},
// 			{
// 				version     : '0.2.0',
// 				name        : 'module-two',
// 				description : 'another description larger than the max',
// 			},
// 		], {
// 			showHeaders : false,
// 			minWidth    : 12,
// 			config      : { description: { maxWidth: 30 } },
// 		} ),
// 		form : () => p.typePrompt( 		{
// 			type    : 'form',
// 			message : 'Please provide the following information:',
// 			choices : [
// 				{
// 					name    : 'firstname',
// 					message : 'First Name',
// 					// @ts-ignore
// 					initial : 'Pigeon',
// 				},
// 				{
// 					name    : 'lastname',
// 					message : 'Last Name',
// 					initial : 'Posse',
// 				},
// 				{
// 					name    : 'username',
// 					message : 'GitHub username',
// 					initial : 'pigeonposse',
// 				},
// 			],
// 		} ),
// 		nose : () => p.typePrompt( 		{
// 			type    : 'scale',
// 			message : 'Please rate your experience',
// 			// @ts-ignore
// 			scale   : [
// 				{
// 					name    : '1',
// 					message : 'Strongly Disagree',
// 				},
// 				{
// 					name    : '2',
// 					message : 'Disagree',
// 				},
// 				{
// 					name    : '3',
// 					message : 'Neutral',
// 				},
// 				{
// 					name    : '4',
// 					message : 'Agree',
// 				},
// 				{
// 					name    : '5',
// 					message : 'Strongly Agree',
// 				},
// 			],
// 			margin : [
// 				0,
// 				0,
// 				2,
// 				1,
// 			],
// 			choices : [
// 				{
// 					name    : 'interface',
// 					message : 'The website has a friendly interface.',
// 					initial : 2,
// 				},
// 				{
// 					name    : 'navigation',
// 					message : 'The website is easy to navigate.',
// 					initial : 2,
// 				},
// 				{
// 					name    : 'images',
// 					message : 'The website usually has good images.',
// 					initial : 2,
// 				},
// 				{
// 					name    : 'upload',
// 					message : 'The website makes it easy to upload images.',
// 					initial : 2,
// 				},
// 				{
// 					name    : 'colors',
// 					message : 'The website has a pleasing color palette.',
// 					initial : 2,
// 				},
// 			],
// 		} ),
// 		age   : () => p.number( { message: 'What is your age?' } ),
// 		// @ts-ignore
// 		color : ( { results } ) => p.multiselect( {
// 			message : `What is your favorite color ${results.name}?`,
// 			options : [
// 				{
// 					value : 'red',
// 					label : 'Red',
// 				},
// 				{
// 					value : 'green',
// 					label : 'Green',
// 				},
// 				{
// 					value : 'blue',
// 					label : 'Blue',
// 				},
// 			],
// 		} ),
// 		tasks : async () => {

// 			p.log.message( )
// 			await tasks( {
// 				title : 'My Task',
// 				task  : [
// 					{
// 						title : 'Task 1',
// 						task  : async () => await setTimeout( 1000 ),
// 					},
// 					{
// 						title : 'Task concurrent',
// 						task  : [
// 							{
// 								title : 'Task concurrent 1',
// 								task  : async () => await setTimeout( 1000 ),
// 							},
// 							{
// 								title : 'Task concurrent 2',
// 								task  : async () => await setTimeout( 1000 ),
// 							},
// 						],
// 						concurrent : true,
// 					},
// 				],
// 				collapseSubtasks : false,
// 				exitOnError      : false,
// 				timer            : true,
// 			}, log )
// 			p.log.message( )

// 		},
// 		// @ts-ignore
// 		execute : async ( { results } ) => {

// 			try {

// 				const spinner = p.spinner()
// 				spinner.start( 'Executing...' )
// 				spinner.message( results.name )
// 				await setTimeout( 5000 )
// 				spinner.message( results.age )
// 				spinner.stop( 'Installed via npm' )
// 				return true

// 			}
// 			catch ( _e ) {

// 				return false

// 			}

// 		},
// 	} ),
// } )

// console.log( )
// console.log( results )
