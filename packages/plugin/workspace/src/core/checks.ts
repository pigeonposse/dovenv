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
} from '@dovenv/core/utils'

import { Super } from './_super/main'

import type { PackageJSON } from '@dovenv/core/utils'

type CheckType = NonNullable<NonNullable<Checks['opts']>['check']>
type CheckPkgValue = NonNullable<NonNullable<CheckType['pkg']>[number]>
type CheckPattern = CheckPkgValue['include']

export class Checks extends Super {

	pkgs : ( {
		id      : string
		path    : string
		content : PackageJSON
	} )[] | undefined

	async #getPKGs() {

		if ( this.pkgs ) return this.pkgs

		const pkgPaths = await this.utils.getPkgPaths()

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

	async #schemaPKG( value: CheckPkgValue ) {

		const type = value
		if ( !type?.schema ) return

		const pkgs = await this.#getPKGs()

		for ( const pkg of pkgs ) {

			const schema = await type.schema( {
				v       : validate,
				path    : pkg.path,
				content : pkg.content,
				utils   : this.utils,
			} )

			if ( !schema ) continue

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
					[ `Path`, pkg.path ],
					[ `Schema must be`, content ],
					[ errorMessage, '' ],
				] )

				throw new Error( errortitle + this.utils.style.indent( errorMsg ) )

			}

		}

		console.log( this.utils.style.success.h( 'Check passed for schema' ) )

	}

	async #structure( value: CheckPkgValue ) {

		const type = value
		if ( !type ) return

		const pkgs   = await this.#getPKGs()
		const custom = async () => {

			for ( const pkg of pkgs ) {

				const dir    = getDirName( pkg.path )
				const cbData = {
					dir     : dir,
					path    : pkg.path,
					content : pkg.content,
					utils   : this.utils,
				}

				if ( type?.custom ) {

					await type.custom( cbData )

				}

			}

			console.log( this.utils.style.success.h(
				'Custom check passed',
			) )

		}
		const set = async ( data: CheckPattern, exists = false ) => {

			for ( const pkg of pkgs ) {

				const dir    = getDirName( pkg.path )
				const cbData = {
					dir     : dir,
					path    : pkg.path,
					content : pkg.content,
					utils   : this.utils,
				}

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
					errorMsg    += this.utils.style.error.lk( `Pattern: ${getDirName( joinPath( dir, pattern ) )}\n` )

					if ( exists && !paths.length ) {

						errorMsg += this.utils.style.error.lk( `Validation error: Must exists Pattern: ${pattern}` )

						throw new Error( errorMsg )

					}
					else if ( !exists && paths.length ) {

						errorMsg += this.utils.style.error.lk( `Validation error: Must not exists Pattern: ${pattern}` )

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
						errorMsg           += this.utils.style.error.lk( `Path: ${pkg.path}.\n` )
						errorMsg           += this.utils.style.error.lk( `Valid structure:\n${this.utils.style.box( {
							title : pkg.id,
							data  : structurePath,
						} )}\n` )
						errorMsg           += this.utils.style.error.lk( `Validation error: Must ${exists ? 'exists' : 'not exists'} path: ${path}` )

						throw new Error( errorMsg )

					}

				}

			}

		}

		if ( type?.include ) await set( type.include, true )
		if ( type?.exclude ) await set( type.exclude, false )
		if ( type?.custom ) await custom()

		if ( type?.include || type?.exclude ) console.log( this.utils.style.success.h(
			'Check passed for routes (include/exclude)',
		) )

	}

	async runOne( opt: CheckPkgValue ) {

		await this.#structure( opt )
		await this.#schemaPKG( opt )
		console.log()

	}

	async #fn( pattern?: string[] ) {

		// this._title( 'Checks workspace structure' )
		const input = this.opts?.check?.pkg
		const keys  = await this.utils.getOptsKeys( {
			input,
			pattern,
		} )

		if ( !keys || !this.opts ) return
		for ( const key of keys ) {

			const opt = input?.[key]
			if ( !opt ) continue

			await this.runOne( opt )

		}

	}

	async run( pattern?: string[] ) {

		return await this._envolvefn( this.#fn( pattern ) )

	}

}
