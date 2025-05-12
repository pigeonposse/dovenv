/* eslint-disable @stylistic/object-curly-newline */
import {
	readFile,
} from '@dovenv/utils'

import { TYPE }   from './const'
import { schema } from './schema'
import { CheckConfig,
	CheckCustom,
	CheckDir,
	CheckFile } from './types'
import { Command } from '../_shared/main'

import type {
	ArgvParsed,
} from '../../_shared/types'

export class Check extends Command<CheckConfig> {

	argv
	load

	constructor( argv : ArgvParsed ) {

		super( argv.utils.config?.check, argv.utils )

		this.utils.title = 'check'
		this.argv        = argv
		this.schema      = schema( this.utils.validate )
		this.load        = this.utils.spinner()

	}

	async #validateWrap( fn: Promise<void> | void ) {

		try {

			return await fn

		}
		catch ( e ) {

			this.load.fail( this.utils.style.error.msg( ( e instanceof Error ? e.message : JSON.stringify( e ) ) ) )
			// this.load.fail( `${color.red( `${key}:` )} ` + ( e instanceof Error ? e.message : JSON.stringify( e ) ) )
			this.utils.exitWithError()

		}

	}

	async file( prop: CheckFile ) {

		const paths = ( await this.utils.getPaths( prop.patterns, {
			onlyFiles : true,
		} ) )

		if ( !paths.length ) {

			this.load.warn( this.utils.style.warn.msg( 'No files matched the patterns' ) )
			return

		}
		if ( !prop.validateAll && !prop.validate ) {

			this.load.warn( this.utils.style.warn.msg( 'Skipped because no validate function exists' ) )
			return

		}

		if ( prop.validateAll )
			await this.#validateWrap( prop.validateAll( {
				paths,
				utils : this.utils,
			} ) )

		if ( prop.validate ) {

			for ( const path of paths ) {

				const content = await readFile( path )
				await this.#validateWrap(
					prop.validate( {
						path,
						content : content.toString(),
						utils   : this.utils,
					} ),
				)

			}

		}
		this.load.succeed( this.utils.style.success.msg( 'All file checks passed' ) )

	}

	async dir( prop: CheckDir ) {

		const paths = ( await this.utils.getPaths( prop.patterns, {
			onlyDirectories : true,
		} ) )

		if ( !paths.length ) {

			this.load.warn( this.utils.style.warn.msg( 'No directories matched the patterns' ) )
			return

		}
		if ( !prop.validateAll && !prop.validate ) {

			this.load.warn( this.utils.style.warn.msg( 'Skipped because no validate function exists' ) )
			return

		}
		if ( prop.validateAll )
			await this.#validateWrap( prop.validateAll( {
				paths,
				utils : this.utils,
			} ) )

		if ( prop.validate ) {

			for ( const path of paths ) {

				await this.#validateWrap( prop.validate( {
					path,
					utils : this.utils,
				} ) )

			}

		}
		this.load.succeed( this.utils.style.success.msg( 'All directory checks passed' ) )

	}

	async custom( prop: CheckCustom ) {

		await this.#validateWrap( prop.fn( {
			utils : this.utils,
			run   : {
				dir  : this.dir.bind( this ),
				file : this.file.bind( this ),
			},
		} ) )
		this.load.succeed( this.utils.style.success.msg( 'Check function succesfully passed' ) )

	}

	async multiple( props: CheckConfig ) {

		const userKeys = this.getKeysFromArgv( Object.keys( props ), this.argv )
		if ( !userKeys || !userKeys.length ) return
		const { style } = this.utils
		for ( const key of userKeys ) {

			const prop = props[key]

			console.log(
				style.info.h1( key ),
				style.info.b( `(${prop.type})` ),
				prop.desc ? style.info.p( prop.desc ) : '',
			)

			if ( prop.type === TYPE.DIR )
				await this.dir( prop )
			else if ( prop.type === TYPE.FILE )
				await this.file( prop )
			else if ( prop.type === TYPE.CUSTOM )
				await this.custom( prop )
			else console.warn( style.warn.p( `Unexpected or not provided type in ${style.badge( key )}` ) )
			console.log()

		}

	}

	async #fn() {

		if ( !( await this.utils.ensureOpts( { input: this.opts } ) ) ) return

		const opts = this.opts || {}
		await this.validateSchema( opts )

		await this.multiple( opts )

	}

	async run() {

		return await this.utils.catchFn( this.#fn( ) )

	}

}
