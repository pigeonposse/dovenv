import {
	open as _open,
	existsFile,
	formatValidationError,
	getBaseName,
	getPaths,
	getPathsTree,
	schema2type,
	serializeValidation,
	validate,
	getObjectFromJSONFile,
	getDirName,
	joinPath,
} from '@dovenv/utils'

import { Super } from './_super/main'

import type { PackageJSON } from '@dovenv/utils'

type CheckType = NonNullable<NonNullable<Super['config']>['check']>
type CheckPattern = NonNullable<NonNullable<CheckType['pkg']>['include']>

export class Checks extends Super {

	pkgs : ( {
		id      : string
		path    : string
		content : PackageJSON
	} )[] | undefined

	async #getPKGs() {

		if ( this.pkgs ) return this.pkgs

		const pkgPaths = await this._getPkgPaths()

		this.pkgs = []

		for ( const pkgPath of pkgPaths ) {

			const pkg = await getObjectFromJSONFile<PackageJSON>( pkgPath )

			this.pkgs.push( {
				id      : pkg.name || getBaseName( pkgPath ),
				path    : pkgPath,
				content : pkg,
			} )

		}
		return this.pkgs

	}

	async schemaPKG() {

		const type = this.config?.check?.pkg
		if ( !type?.schema ) return

		const pkgs = await this.#getPKGs()

		for ( const pkg of pkgs ) {

			const schema = await type.schema( {
				v       : validate,
				path    : pkg.path,
				content : pkg.content,
			} )

			if ( !schema ) continue

			const result = schema.safeParse( pkg.content )
			if ( !result.success ) {

				const errorMessage = formatValidationError( result.error )

				const content = ( await schema2type( {
					schema          : serializeValidation( schema ),
					required        : true,
					noUnknownObject : true,
				} ) )

				let errorMsg = `Error in [${pkg.id}] package.json\n\n`
				errorMsg    += this._style.errorPoint( `Path: ${pkg.path}.\n` )
				errorMsg    += this._style.errorPoint( `Schema must be: ${content}\n` )
				errorMsg    +=  this._style.errorPoint( errorMessage )

				throw new Error( errorMsg )

			}

		}

		this._succedMsg( 'Schema check passed' )

	}

	async structure() {

		const type = this.config?.check?.pkg
		if ( !type ) return

		const pkgs = await this.#getPKGs()

		const set = async ( data: CheckPattern, exists = false ) => {

			for ( const pkg of pkgs ) {

				const dir    = getDirName( pkg.path )
				const cbData = {
					dir     : dir,
					path    : pkg.path,
					content : pkg.content,
				}

				if ( type?.custom ) await type.custom( cbData )

				const res = typeof data === 'function'
					? await data( cbData )
					: data

				if ( !res ) continue

				const patternOpts: Parameters<typeof getPaths>[1] = {
					cwd       : dir,
					onlyFiles : true,
				}

				for ( const pattern of res ) {

					const paths = await getPaths( [ pattern ],  patternOpts )

					let errorMsg = `Error in [${pkg.id}] file structure.\n\n`
					errorMsg    += this._style.errorPoint( `Pattern: ${getDirName( joinPath( dir, pattern ) )}\n` )

					if ( exists && !paths.length ) {

						errorMsg += this._style.errorPoint( `Validation error: Must exists Pattern: ${pattern}` )

						throw new Error( errorMsg )

					}
					else if ( !exists && paths.length ) {

						errorMsg += this._style.errorPoint( `Validation error: Must not exists Pattern: ${pattern}` )

						throw new Error( errorMsg )

					}

					for ( const path of paths ) {

						const existsCurr = await existsFile( joinPath( dir, path ) )

						if ( existsCurr === exists ) continue

						const structurePath = await getPathsTree( {
							input       : res,
							patternOpts : { onlyFiles: true },
						} )
						let errorMsg        = `Error in [${pkg.id}] file structure.\n\n`
						errorMsg           += this._style.errorPoint( `Path: ${pkg.path}.\n` )
						errorMsg           += this._style.errorPoint( `Valid structure:\n${this._box( {
							title : pkg.id,
							data  : structurePath,
						} )}\n` )
						errorMsg           += this._style.errorPoint( `Validation error: Must ${exists ? 'exists' : 'not exists'} path: ${path}` )

						throw new Error( errorMsg )

					}

				}

			}

		}

		if ( type?.include ) await set( type.include, true )
		if ( type?.exclude ) await set( type.exclude, false )

		this._succedMsg( 'Structure check passed' )

	}

	async #fn( ) {

		this._title( 'Checks workspace structure' )

		await this.structure( )
		await this.schemaPKG( )

	}

	async run(  ) {

		return await this._envolvefn( this.#fn(  ) )

	}

}
