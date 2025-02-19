import { createCLI } from './cli-create'

await createCLI( {
	name    : 'TEST',
	version : '1',
	// examples : COMMAD?.examples,
	cmds    : { k : {
		desc : 'say hello',
		fn   : async d => console.log( d ),
	} },
	// cmds : COMMAD?.cmds
	// 	? Object.fromEntries( Object.entries( COMMAD.cmds ).map( ( [ key, value ] ) => [
	// 		key,
	// 		{
	// 			...value,
	// 			settings : COMMAD.settings,
	// 			fn       : async data => await COMMAD.fn( data ),
	// 		},
	// 	] ) )
	// 	: undefined,
	// hook : async ( {
	// 	cli, argv,
	// } ) => {

	// 	const d = await cli.argv
	// 	console.log( {
	// 		d,
	// 		argv,
	// 	} )
	// 	return cli

	// },
} )
