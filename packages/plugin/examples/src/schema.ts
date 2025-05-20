import { validate as v } from '@dovenv/core/utils'

const infoSchema = v.object( {
	input : v.string(),
	title : v.string().optional(),
	type  : v.string().optional(),
	desc  : v.string().optional(),
	outro : v.string().optional(),
} )

const exampleSchema = v.object( {
	title : v.string().optional(),
	desc  : v.string().optional(),
	outro : v.string().optional(),
	data  : v.record( v.string(), infoSchema ),
} )

export const schema = v.record( v.string(), exampleSchema )

