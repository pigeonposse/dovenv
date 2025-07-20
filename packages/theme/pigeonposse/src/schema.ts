import { defineConfig } from '@dovenv/core'
import { catchError }   from '@dovenv/core/utils'

export const pigeonSchemas = defineConfig( { check : { 'pigeonposse-consts' : {
	type : 'custom',
	desc : 'Check schemas for PigeonPosse necessary constants',
	fn   : async ( { utils } ) => {

		type V = Parameters<typeof utils.validateSchema>
		const validate = async ( s:V[0], v:V[1], name: string ) => {

			const [ e, _r ] = await catchError( utils.validateSchema( s, v ) )
			if ( e ) throw new Error( `Dovenv [${name}] constant has invalid schema.\n\n${e.message}` )

		}
		const { config } = utils
		const z          = utils.validate
		const wsDir      = config?.const?.wsDir || config?.const?.workspaceDir

		if ( !wsDir || typeof wsDir !== 'string' )
			throw new Error( 'Must exist [wsDir] or [workspaceDir] string const in dovenv configuration' )
		if ( !config?.const?.pkg || typeof config.const.pkg !== 'object' )
			throw new Error( 'Must exist [pkg] const in dovenv configuration' )
		if ( !config.const?.mark )
			throw new Error( 'Must exist [mark] const in dovenv config.\nThis must be a text, for example a watermark, a trademark, or a simple text about the project.' )

		await validate( z.object( {
			name        : z.string(),
			description : z.string(),
			homepage    : z.string(),
			funding     : z.object( { url: z.url() } ),
			repository  : z.object( { url: z.url() } ),
			bugs        : z.object( { url: z.url() } ),
			license     : z.string(),

			extra : z.object( {
				id          : z.string(),
				productName : z.string(),
				shortDesc   : z.string().optional(),
				action      : z.string().optional(),
				type        : z.union( [ z.string(), z.array( z.string() ) ] ).optional(),
				subtype     : z.array( z.string() ).optional(),

				// Deprecated fields (removed)
				// repoId     : z.string().optional().describe( 'Deprecated' ),
				// libraryId  : z.string().optional().describe( 'Deprecated' ),
				// libraryUrl : z.url().optional().describe( 'Deprecated' ),
				// docsUrl    : z.url().optional().describe( 'Deprecated' ),
				// licenseUrl : z.url().optional().describe( 'Deprecated' ),

				repoID          : z.string().optional(),
				libraryID       : z.string().optional(),
				libraryURL      : z.url().optional(),
				licenseURL      : z.url().optional(),
				docsURL         : z.url().optional(),
				changelogURL    : z.url().optional(),
				contributingURL : z.url().optional(),
				rawRepoURL      : z.url().optional(),

				collective : z.object( {
					id         : z.string(),
					name       : z.string(),
					funding    : z.url(),
					about      : z.url(),
					url        : z.url(),
					email      : z.email(),
					gh         : z.url(),
					web        : z.url().optional(),
					socialUser : z.object( {
						twitter   : z.string().optional(),
						instagram : z.string().optional(),
						medium    : z.string().optional(),
					} ).optional(),
					social : z.object( {
						twitter   : z.url(),
						instagram : z.url(),
						medium    : z.url(),
					} ),
				} ),

			} ).optional(),
		} ), config.const.pkg, 'pkg' )

	},
} } } )

