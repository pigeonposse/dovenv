// import changeset from '@changesets/cli/bin.js'

import {
	deprecatedAlerts,
	exec,
	runLocalBin,
} from '@dovenv/core/utils'

import { Repo } from '../_super/main'

export class Packages extends Repo {

	async #exec( args?: string[] ) {

		try {

			const alerts = deprecatedAlerts()
			alerts.hide()
			const exitCode = await runLocalBin( {
				name : 'changeset',
				args,
			} )

			// TODO: CATCH ON CANCEL ENVENT IN `runLocalBin`
			console.debug( { exitCode } )
			return exitCode

		}
		catch ( error ) {

			if ( error instanceof Error )
				await this.onCancel()

		}

	}

	async init() {

		await this.#exec( [ 'init' ] )

	}

	async publish( preCmd?: string ) {

		console.log( this.style.info.hr( 'Publish packages' ) )
		if ( preCmd && typeof preCmd === 'string' ) await exec( preCmd )
		return await this.#exec( [ 'publish' ] )

	}

	async version() {

		console.log( this.style.info.hr( 'Update package version' ) )
		return await this.#exec( [ 'version' ] )

	}

	async prepare() {

		console.log( this.style.info.hr( 'Prepare update' ) )
		return await this.#exec( )

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

		const cache  = await this.cache( 'pkg-ask', defaultData )
		const cached = await cache.get()

		console.debug( 'cached data', cached )

		return await this.promptGroup( {
			onCancel : async () => await this.onCancel(),
			list     : async p => ( {
				prepare : async () => {

					const res = await p.confirm( {
						message      : 'Do you want to prepare the version(s)?',
						initialValue : cached[data.prepare],
					} )
					if ( p.isCancel( res ) ) return await this.onCancel()
					cache.set( { [data.prepare]: res } )
					if ( !res ) return res
					await this.prepare()
					console.log( this.style.info.hr() )

				},
				[data.version] : async () => {

					const res = await p.confirm( {
						message      : 'Do you want to update the version of the package(s) now?',
						initialValue : cached[data.version],
					} )
					if ( p.isCancel( res ) ) return await this.onCancel()
					cache.set( { [data.version]: res } )

					if ( !res ) return res

					await this.version()
					console.log( this.style.info.hr() )

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
						value : `Best practices before publishing:\n\n${list.map( l => this.style.info.lk( l ) ).join( '\n' )}\n\n`,
						opts  : {
							borderStyle : 'none',
							padding     : 0,
							dimBorder   : true,
						},
					} )

					const res = await p.select( {
						message : 'Do you want to publish the package now?',
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
					if ( p.isCancel( res ) ) return await this.onCancel()

					cache.set( { [data.publishOrRun]: res } )

					if ( res === publishOrRun.publish ) {

						await this.publish()
						console.log( this.style.info.hr() )

					}
					else if ( res === publishOrRun.run ) {

						const command = await p.text( {
							message      : 'What command do you want to run?',
							initialValue : cached[data.command],
						} )

						if ( p.isCancel( command ) ) return await this.onCancel()
						cache.set( { [data.command]: command } )
						await this.publish( command )
						console.log( this.style.info.hr() )

					}
					else if ( res !== publishOrRun.none )
						console.error( this.style.error.msg( 'Unexpected error', 'No publish or run selected' ) )

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

}
