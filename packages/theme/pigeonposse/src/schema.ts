import {
	validate as z,
	formatValidationError,
	schema2type,
	serializeValidation,
} from '@dovenv/core/utils'

import type { ValidateAnyType } from '@dovenv/core/utils'

export const pkgSchema = z.object( {
	name        : z.string(),
	description : z.string(),
	homepage    : z.string(),
	funding     : z.object( { url: z.string().url() } ),
	repository  : z.object( { url: z.string().url() } ),
	bugs        : z.object( { url: z.string().url() } ),
	license     : z.string(),

	extra : z.object( {
		id          : z.string(),
		productName : z.string(),
		shortDesc   : z.string().optional(),
		action      : z.string().optional(),
		type        : z.string().optional(),
		subtype     : z.array( z.string() ).optional(),

		// Deprecated fields
		repoId     : z.string().optional().describe( 'Deprecated' ),
		libraryId  : z.string().optional().describe( 'Deprecated' ),
		libraryUrl : z.string().url().optional().describe( 'Deprecated' ),
		docsUrl    : z.string().url().optional().describe( 'Deprecated' ),
		licenseUrl : z.string().url().optional().describe( 'Deprecated' ),

		repoID          : z.string().optional(),
		libraryID       : z.string(),
		libraryURL      : z.string().url(),
		licenseURL      : z.string().url(),
		docsURL         : z.string().url(),
		changelogURL    : z.string().url().optional(),
		contributingURL : z.string().url().optional(),
		rawRepoURL      : z.string().url().optional(),

		collective : z.object( {
			id         : z.string(),
			name       : z.string(),
			funding    : z.string().url(),
			about      : z.string().url(),
			url        : z.string().url(),
			email      : z.string().email(),
			gh         : z.string().url(),
			web        : z.string().url().optional(),
			socialUser : z.object( {
				twitter   : z.string().optional(),
				instagram : z.string().optional(),
				medium    : z.string().optional(),
			} )
				.optional(),
			social : z.object( {
				twitter   : z.string().url(),
				instagram : z.string().url(),
				medium    : z.string().url(),
			} ),
		} ),

	} ),
} )

export const markSchema = z.string()
export const templateMarkSchema = z.string()
export const wsDirSchema = z.string()

export const validateSchema = async ( schema: ValidateAnyType, data: unknown, title: string ) => {

	const result = schema.safeParse( data )
	if ( !result.success ) {

		const errorMessage = formatValidationError( result.error )

		const content = ( await schema2type( {
			schema          : serializeValidation( schema ),
			required        : true,
			noUnknownObject : true,
		} ) )

		throw new Error( `Dovenv [${title}] constant has invalid schema. Schema must be:\n\n[${title}] ${content}\n\n${errorMessage}` )

	}

}
