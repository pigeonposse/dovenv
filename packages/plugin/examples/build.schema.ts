import {
	writeFile,
	zod2schema,
} from '@dovenv/core/utils'

import { schema } from './src/schema'

const schemaOBJ = await zod2schema( { schema: schema } )

await writeFile( 'schema.json', JSON.stringify( schemaOBJ, undefined, '\t' ) )
