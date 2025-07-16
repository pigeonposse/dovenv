import { validate as v } from '@dovenv/core/utils'

const infoSchema = v.object( {
	input : v.string().describe( 'Example input. Can be a file or a string' ),
	title : v.string().optional().describe( 'Example title' ),
	type  : v.string().optional().describe( 'Input type. For example: bash, js, ts etc' ),
	desc  : v.string().optional().describe( 'Example description' ),
	outro : v.string().optional().describe( 'Example outro' ),
} )

const exampleSchema = v.object( {
	title : v.string().optional().describe( 'Example title' ),
	desc  : v.string().optional().describe( 'Example description' ),
	outro : v.string().optional().describe( 'Example outro' ),
	data  : v.record( v.string(), infoSchema ),
} )

export const schema = v.record( v.string(), exampleSchema )

