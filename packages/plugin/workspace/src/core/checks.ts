import {
	open as _open,
	existsFile,
	formatValidationError,
	getPaths,
	getPathsTree,
	schema2type,
	serializeValidation,
	validate,
	getDirName,
	joinPath,
} from '@dovenv/core/utils'

import { Super } from './_super/main'

type CheckType = NonNullable<NonNullable<Checks['opts']>['check']>
type CheckPkgValue = NonNullable<NonNullable<CheckType['pkg']>[number]>
type CheckPattern = CheckPkgValue['include']

export class Checks extends Super {

	async #schemaPKG( value: CheckPkgValue ) {

		if ( !value?.schema ) return

		const pkgs = await this.utils.getPkgsData()

		await Promise.all( pkgs.map( async pkg => {

			const schema = await value.schema?.( {
				v       : validate,
				path    : pkg.packagePath,
				content : pkg.content,
				utils   : this.utils,
			} )

			if ( !schema ) return

			const result = schema.safeParse( pkg.content )
			if ( !result.success ) {

				const errorMessage = formatValidationError( result.error )

				const content = '\n' + ( await schema2type( {
					schema          : serializeValidation( schema ),
					required        : true,
					noUnknownObject : true,
				} ) )

				const errortitle = `Error in ${this.utils.style.b( pkg.id )} package.json\n\n`
				const errorMsg   = this.utils.style.error.ul( [
					[ `Path`, pkg.packagePath ],
					[ `Schema must be`, content ],
					[ errorMessage, '' ],
				] )

				throw new Error( errortitle + this.utils.style.indent( errorMsg ) )

			}

		} ) )

	}

	async #structure( value: CheckPkgValue ) {

		const type = value
		if ( !type ) return

		const pkgs = await this.utils.getPkgsData()

		const set = async ( data: CheckPattern, exists = false ) => {

			await Promise.all( pkgs.map( async pkg => {

				const cbData = {
					dir     : pkg.dir,
					path    : pkg.packagePath,
					content : pkg.content,
					utils   : this.utils,
				}

				const res = typeof data === 'function'
					? await data( cbData )
					: data

				if ( !res ) return

				const patternOpts: Parameters<typeof getPaths>[1] = {
					cwd       : pkg.dir,
					onlyFiles : true,
				}

				for ( const pattern of res ) {

					const paths = await getPaths( [ pattern ], patternOpts )

					let errorMsg = `Error in [${pkg.id}] file structure.\n\n`
					errorMsg    += this.utils.style.error.lk( `Pattern: ${getDirName( joinPath( pkg.dir, pattern ) )}\n` )

					if ( exists && !paths.length ) {

						errorMsg += this.utils.style.error.lk( `Validation error: Must exists Pattern: ${pattern}` )

						throw new Error( errorMsg )

					}
					else if ( !exists && paths.length ) {

						errorMsg += this.utils.style.error.lk( `Validation error: Must not exists Pattern: ${pattern}` )

						throw new Error( errorMsg )

					}

					await Promise.all( paths.map( async path => {

						const existsCurr = await existsFile( joinPath( pkg.dir, path ) )

						if ( existsCurr === exists ) return

						const structurePath = await getPathsTree( {
							input       : res,
							patternOpts : { onlyFiles: true },
						} )
						let errorMsg        = `Error in [${pkg.id}] file structure.\n\n`
						errorMsg           += this.utils.style.error.lk( `Path: ${pkg.packagePath}.\n` )
						errorMsg           += this.utils.style.error.lk( `Valid structure:\n${this.utils.style.box( {
							title : pkg.id,
							data  : structurePath,
						} )}\n` )
						errorMsg           += this.utils.style.error.lk( `Validation error: Must ${exists ? 'exists' : 'not exists'} path: ${path}` )

						throw new Error( errorMsg )

					} ) )

				}

			} ) )

		}

		if ( type?.include ) await set( type.include, true )
		if ( type?.exclude ) await set( type.exclude, false )
		if ( type?.custom ) await Promise.all(
			pkgs.map( async pkg => await type.custom?.( {
				dir     : pkg.dir,
				path    : pkg.packagePath,
				content : pkg.content,
				utils   : this.utils,
			} ) ),
		)

		if ( type?.include || type?.exclude ) console.log( this.utils.style.success.h(
			'Check passed for routes (include/exclude)',
		) )

	}

	async runOne( opt: CheckPkgValue ) {

		await this.#structure( opt )
		await this.#schemaPKG( opt )

	}

	async #fn( pattern?: string[] ) {

		const input = this.opts?.check?.pkg
		await this.utils.mapOpts( {
			input,
			pattern,
			cb : async ( { value } ) => {

				if ( !value ) return

				await this.runOne( value )

			},
		} )

	}

	async run( pattern?: string[] ) {

		return await this._envolvefn( this.#fn( pattern ) )

	}

}
