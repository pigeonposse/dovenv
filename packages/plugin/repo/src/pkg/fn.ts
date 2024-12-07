// import changeset from '@changesets/cli/bin.js'

import {
	deprecatedAlerts,
	exec,
	runLocalBin,
} from '@dovenv/core/utils'

import { Repo } from '../_super/main'

export class Packages extends Repo {

	// async #line( title?: string ) {

	// 	if ( title )
	// 		console.log( line( {
	// 			title    : this.sty.dim( title ),
	// 			lineChar : ' ',
	// 		} ) )
	// 	console.log( line( {
	// 		title    : '',
	// 		lineChar : this._color.dim( icon.line ),
	// 	} ) )

	// }

	async #exec( args?: string[] ) {

		// const replace = replaceConsole( { params: { 'changeset init': '$0 pkg init' } } )
		// replace.start()
		const alerts = deprecatedAlerts()
		alerts.hide()
		const exitCore = await runLocalBin( {
			name : 'changeset',
			args,
		} )

		// replace.stop()
		return exitCore

	}

	async init() {

		await this.#exec( [ 'init' ] )

	}

	async publish( preCmd?: string ) {

		this.style.get.line( 'Publish packages' ).start()
		if ( preCmd && typeof preCmd === 'string' ) await exec( preCmd )
		return await this.#exec( [ 'publish' ] )

	}

	async version() {

		this.style.get.line( 'Update package version' ).start()
		return await this.#exec( [ 'version' ] )

	}

	async prepare() {

		this.style.get.line( 'Prepare update' ).start()
		return await this.#exec( )

	}

	async ask() {

		const publishOrRun = {
			publish : 'publish',
			run     : 'run',
		} as const
		const data         = {
			publishOrRun : 'publish-or-run',
			version      : 'version',
			command      : 'command',
		} as const
		const defaultData  = {
			[data.publishOrRun] : Object.values( publishOrRun )[0],
			[data.version]      : true,
			[data.command]      : '',
		}

		const cache = await this.cache( 'pkg-ask', defaultData )

		const cached = await cache.get()
		return await this.promptGroup( {
			onCancel : async () => this.onCancel(),
			list     : async p => ( {
				prepare : () => this.prepare(),
				version : async () => {

					const res = await p.confirm( {
						message      : 'Do you want to update package version?',
						initialValue : cached[data.version],
					} )
					if ( res ) await this.version()

				},
				publish : async ( { results } ) => {

					let list = []

					if ( 'version' in results ) list.push( 'Update version of package/s' )
					list = [
						...list,
						'Build your package/s',
						'Run tests for ensure everything is ok',
					]

					await p.box( {
						value : 'Best practices before publishing:\n\n' + list.map( l => this.style.get.listKey( l ) ).join( '\n' ) + '.',
						opts  : {
							borderStyle : 'none',
							padding     : 1,
						},
					} )
					const res = await p.select( {
						message : 'Do you want to publish the package now or run a command first?',
						options : [
							{
								value : publishOrRun.publish,
								label : 'Publish package',
							},
							{
								value : publishOrRun.run,
								label : 'Run a command first',
							},
						] as const,
						initialValue : cached[data.publishOrRun],
					} )

					if ( res === publishOrRun.publish ) await this.publish()
					else if ( res === publishOrRun.run ) {

						const command = await p.text( {
							message      : 'What command do you want to run?',
							initialValue : cached[data.command],
						} )

						if ( typeof command !== 'string' ) return

						await this.publish( command )

					}
					else console.error( this.style.get.error( 'Unexpected error: No publish or run selected' ) )

				},
			} ),
		} )

	}

	async release() {

		try {

			await this.prepare()
			await this.version()
			await this.publish()

			// const promptResCode = await this.prompt()
			// console.debug( { promptResCode } )
			// if ( promptResCode !== 0 )
			// 	throw new Error( 'Release cancelled' )
			// const versionResCode = await this.version()
			// console.debug( { versionResCode } )
			// if ( versionResCode !== 0 )
			// 	throw new Error( 'Version update cancelled' )
			// const publishResCode = await this.publish()
			// console.debug( { publishResCode } )
			// if ( publishResCode !== 0 )
			// 	throw new Error( 'Publish cancelled' )

		}
		catch ( error ) {

			if ( error instanceof Error )
				console.error( 'Release failed:', error.message )
			else console.error( 'Release failed:', error )

		}

	}

}
