// import changeset from '@changesets/cli/bin.js'

import {
	catchError,
	deprecatedAlerts,
	exec,
	getObjectFromFile,
	getPackageVersion,
	LazyLoader,
} from '@dovenv/core/utils'

import { Repo } from '../_super/main'

import type { PackageJSON } from '../_super/types'

const _deps = new LazyLoader( { sizium: () => import( '@sizium/core' ) } )

export class Packages extends Repo {

	async #exec( args?: string[] ) {

		try {

			const alerts = deprecatedAlerts()
			alerts.hide()

			await this.utils.execPkgBin( '@changesets/cli', args )

		}
		catch ( error ) {

			if ( error instanceof Error )
				await this.utils.onCancel()

		}

	}

	async init() {

		await this.#exec( [ 'init' ] )

	}

	async publish( preCmd?: string ) {

		console.log( this.utils.style.info.hr( 'Publish packages' ) )
		if ( preCmd && typeof preCmd === 'string' ) await exec( preCmd )
		return await this.#exec( [ 'publish' ] )

	}

	async version() {

		console.log( this.utils.style.info.hr( 'Update package version' ) )
		return await this.#exec( [ 'version' ] )

	}

	async prepare() {

		console.log( this.utils.style.info.hr( 'Prepare update' ) )
		return await this.#exec( )

	}

	async getPkgVersion( npm = true, showPrivate = true ) {

		const paths = await this.utils.getPkgPaths()
		// execute in parallel
		const res = ( await Promise.all(
			paths.map( async pkgPath => {

				const pkg = await getObjectFromFile<PackageJSON>( pkgPath )

				const pkgPrivate = !!pkg.private && pkg.private !== 'false'

				if ( pkgPrivate && !showPrivate ) return null
				if ( !pkg.name || !pkg.version ) return null

				const [ _, npmVersion ] = npm && !pkgPrivate
					? await catchError( getPackageVersion( pkg.name ) )
					: [ undefined, undefined ]

				return {
					name    : pkg.name,
					version : pkg.version,
					npm     : npmVersion,
					private : pkgPrivate,
				}

			} ),
		) ).filter( v => !!v )

		return res

	}

	async showPackageVersion( npm = true ) {

		const p = this.utils.prompt
		const s = p.spinner()

		try {

			s.start( 'Getting package(s) version info' )
			const pkg = await this.getPkgVersion( npm )
			s.stop( 'Getted pscakge(s) version info' )

			p.log.step( '' )

			await p.box( {
				value : `Your package version(s):\n\n${pkg.map( l => this.utils.style.section.li( l.name, `local: ${l.version}` + ( npm ? ` | npm: ${l.npm || 'none'}` : '' ) + ( l.private ? ` | private` : '' ) ) ).join( '\n' )}\n`,
				opts  : {
					borderStyle : 'none',
					padding     : 0,
					dimBorder   : true,
				},
			} )

		}
		catch ( error ) {

			if ( error instanceof Error )
				p.log.error( error.message )
			else p.log.error( error ? error.toString() : 'Unknown error' )
			s.stop( 'Error getting package version' )

		}

	}

	async ask() {

		const publishOrRun = {
			publish : 'publish',
			run     : 'run',
			none    : 'none',
		} as const
		const data         = {
			publishOrRun : 'publish-or-run',
			prepare      : 'prepare',
			version      : 'version',
			command      : 'command',
		} as const
		const defaultData  = {
			[data.publishOrRun] : Object.values( publishOrRun )[0],
			[data.prepare]      : true,
			[data.version]      : true,
			[data.command]      : '',
		}

		const cache  = await this.utils.cache( 'pkg-ask', defaultData )
		const cached = await cache.get()

		console.debug( 'cached data', cached )

		return await this.utils.promptGroup( {
			onCancel : async () => await this.utils.onCancel(),
			list     : async p => ( {
				prepare : async () => {

					const res = await p.confirm( {
						message      : 'Prepare new version(s)?',
						initialValue : cached[data.prepare],
					} )
					if ( p.isCancel( res ) ) return await this.utils.onCancel()
					await cache.set( { [data.prepare]: res } )
					if ( !res ) return res
					await this.prepare()
					console.log( this.utils.style.info.hr() )

				},
				[data.version] : async () => {

					const res = await p.confirm( {
						message      : 'Update the version of the package(s) with the new prepared versions?',
						initialValue : cached[data.version],
					} )
					if ( p.isCancel( res ) ) return await this.utils.onCancel()
					await cache.set( { [data.version]: res } )

					if ( !res ) return res

					await this.version()
					console.log( this.utils.style.info.hr() )
					await this.showPackageVersion( false )
					return res

				},
				publish : async ( { results } ) => {

					let list = []

					if ( data.version in results )
						list.push( 'Update the version of the package(s)' )

					list = [
						...list,
						'Build your package(s), if necessary',
						'Run the tests to make sure everything works as expected',
					]

					await p.box( {
						value : `Best practices before publishing:\n\n${list.map( l => this.utils.style.section.lk( l ) ).join( '\n' )}\n`,
						opts  : {
							borderStyle : 'none',
							padding     : 0,
							dimBorder   : true,
						},
					} )

					const res = await p.select( {
						message : 'Publish the package now?',
						options : [
							{
								value : publishOrRun.publish,
								label : 'Publish package',
							},
							{
								value : publishOrRun.run,
								label : 'Run a command first',
							},
							{
								value : publishOrRun.none,
								label : 'Skip',
							},
						] as const,
						initialValue : cached[data.publishOrRun],
					} )
					if ( p.isCancel( res ) ) return await this.utils.onCancel()

					await cache.set( { [data.publishOrRun]: res } )

					if ( res === publishOrRun.publish ) {

						await this.publish()
						console.log( this.utils.style.info.hr() )

					}
					else if ( res === publishOrRun.run ) {

						const command = await p.text( {
							message      : 'What command do you want to run?',
							initialValue : cached[data.command],
						} )

						if ( p.isCancel( command ) ) return await this.utils.onCancel()
						await cache.set( { [data.command]: command } )
						await this.publish( command )
						console.log( this.utils.style.info.hr() )

					}
					else if ( res !== publishOrRun.none )
						console.error( this.utils.style.error.msg( 'Unexpected error', 'No publish or run selected' ) )

				},
			} ),
		} )

	}

	async release() {

		try {

			await this.prepare()
			await this.version()
			await this.publish()

		}
		catch ( error ) {

			if ( error instanceof Error )
				console.error( 'Release failed:', error.message )
			else console.error( 'Release failed:', error )

		}

	}

	async getSizeData( name: string = './' ) {

		const { Sizium } = await _deps.get( 'sizium' )
		const pkg        = new Sizium( name )

		return {
			data      : await pkg.get(),
			inputType : pkg.inputType,
		}

	}

	async getSize( name: string = './' ) {

		const pkg  = await this.getSizeData( name )
		const type = pkg.inputType

		const {
			packageNum,
			size,
			id,
			packages,
		} = pkg.data

		const isLocal = type !== 'string'
		const getSize = ( v: number ) => `${( v / ( 1024 * 1024 ) ).toFixed( 2 )}mb (${( v / 1024 ).toFixed( 2 )}kb)`
		let data      = this.utils.style.table( [
			[ 'Name', this.utils.style.info.b( id ) ],
			[ 'Packages Installed', this.utils.style.p( packageNum ) ],
			[ 'Local package', this.utils.style.p( isLocal ) ],
			[ '', '' ], // Empty line
			[ 'Unpacked size', this.utils.style.p( getSize( packages[0].unpackedSize ) ) ],
			[ 'Total size', this.utils.style.success.p( getSize( size ) ) ],
			[ '', '' ], // Empty line
		], { chars : {
			'top'          : '',
			'top-mid'      : '',
			'top-left'     : '',
			'top-right'    : '',
			'bottom'       : '',
			'bottom-mid'   : '',
			'bottom-left'  : '',
			'bottom-right' : '',
			'left'         : '',
			'left-mid'     : '',
			'mid'          : '',
			'mid-mid'      : '',
			'right'        : '',
			'right-mid'    : '',
			'middle'       : '',
		} } )

		if ( !isLocal )
			data += '\n' + this.utils.style.p( `\nView more details in ${this.utils.style.a( `https://sizium.pigeonposse.com/?s=${name}` )}\n` )

		this.utils.prompt.log.message( data )

		return pkg

	}

}
