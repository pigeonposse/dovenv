
import { readFiles } from '@dovenv/utils'

import { TYPE }   from './const'
import { schema } from './schema'
import {
	CheckConfig,
	CheckCustom,
	CheckDir,
	CheckFile,
} from './types'
import { Command } from '../_shared/main'

import type { ArgvParsed } from '../../_shared/types'

export class Check extends Command<CheckConfig> {

	argv

	constructor( argv : ArgvParsed ) {

		super( argv.utils.config?.check, argv.utils )

		this.utils.title = 'check'
		this.argv        = argv
		this.schema      = schema( this.utils.validate )

	}

	async #validateWrap( fn: Promise<void> | void, log: ReturnType<Check['utils']['logGroup']> ) {

		try {

			return await fn

		}
		catch ( e ) {

			log.error( this.utils.style.error.msg( e instanceof Error ? e.message : JSON.stringify( e ) ) )
			this.utils.exitWithError()

		}

	}

	/**
	 * Runs a file check.
	 *
	 * It retrieves the paths using the prop.patterns and calls the prop.validateAll
	 * function with all the paths if it exists. If the prop.validate property is
	 * present, it will be called for each file.
	 *
	 * Logs warnings if no files match the patterns or if no validation function is
	 * provided. Logs success if all file checks are passed.
	 *
	 * @param   {CheckFile}     prop - The file check to run.
	 * @returns {Promise<void>}
	 */
	async file( prop: CheckFile ) {

		const type = '[file]'
		const log  = this.utils.logGroup( prop.title )

		log.info( type, prop.desc || '' )

		const paths = ( await this.utils.getPaths( prop.patterns, { onlyFiles: true } ) )

		if ( !paths.length ) {

			log.warn( type, 'No files matched the patterns' )
			return

		}
		if ( !prop.validateAll && !prop.validate ) {

			log.warn( type, 'Skipped because no validate function exists' )
			return

		}

		if ( prop.validateAll ) await this.#validateWrap(
			prop.validateAll( {
				paths,
				utils : this.utils,
			} ),
			log,
		)

		if ( prop.validate )
			await readFiles( prop.patterns, { hook : { onFile : async ( {
				path, content,
			} ) => {

				await this.#validateWrap(
					prop.validate?.( {
						path,
						content : content.toString(),
						utils   : this.utils,
					} ),
					log,
				)

			} } } )

		log.success( type, 'All file checks passed' )

	}

	/**
	 * Runs a directory check.
	 *
	 * It will get the paths using the prop.patterns and it will
	 * call the prop.validateAll function with all the paths.
	 *
	 * Then, if the prop.validate property exists, it will call it
	 * for each path.
	 *
	 * @param   {CheckDir}      prop - The check to run.
	 * @returns {Promise<void>}
	 */
	async dir( prop: CheckDir ) {

		const type = '[dir]'
		const log  = this.utils.logGroup( prop.title )

		log.info( type, prop.desc || '' )

		const paths = ( await this.utils.getPaths( prop.patterns, { onlyDirectories: true } ) )

		if ( !paths.length ) {

			log.warn( type, 'No directories matched the patterns' )
			return

		}
		if ( !prop.validateAll && !prop.validate ) {

			log.warn( type, 'Skipped because no validate function exists' )
			return

		}
		if ( prop.validateAll ) await this.#validateWrap(
			prop.validateAll( {
				paths,
				utils : this.utils,
			} ),
			log,
		)

		if ( prop.validate ) await Promise.all(
			paths.map( path => this.#validateWrap( prop.validate?.( {
				path,
				utils : this.utils,
			} ), log ) ),
		)
		log.success( type, 'All directory checks passed' )

	}

	/**
	 * Runs a custom check.
	 *
	 * The check function will receive an object with two properties:
	 * - `utils`: An object with some useful functions.
	 * - `run`: An object with two methods:
	 * - `dir`: A method to run a directory check.
	 * - `file`: A method to run a file check.
	 *
	 * @param   {CheckCustom}   prop - The check to run.
	 * @returns {Promise<void>}
	 */
	async custom( prop: CheckCustom ) {

		const type = '[custom]'
		const log  = this.utils.logGroup( prop.title )

		log.info( type, prop.desc || '' )

		await this.#validateWrap( prop.fn( {
			utils : this.utils,
			run   : {
				dir  : this.dir.bind( this ),
				file : this.file.bind( this ),
			},
		} ), log )
		log.success( type, 'Check function succesfully passed' )

	}

	/**
	 * Runs multiple checks.
	 *
	 * It will run all the checks defined in the props object,
	 * and it will respect the order of the keys in the object.
	 *
	 * If no keys are provided in the argv, it will be skipped.
	 *
	 * @param   {CheckConfig}   props - The checks to run.
	 * @returns {Promise<void>}
	 */
	async multiple( props: CheckConfig ) {

		const userKeys = this.getKeysFromArgv( Object.keys( props ), this.argv )
		if ( !userKeys || !userKeys.length ) return

		const log = this.utils.logGroup( 'Multiple checks' )

		await Promise.all( userKeys.map( async key => {

			const prop =  {
				title : key,
				...props[key],
			}

			if ( prop.type === TYPE.DIR )
				await this.dir( prop )
			else if ( prop.type === TYPE.FILE )
				await this.file( prop )
			else if ( prop.type === TYPE.CUSTOM )
				await this.custom( prop )
			else log.warn( `Unexpected or not provided type in ${this.utils.style.badge( key )}` )

		} ) )
		log.step( )
		log.success( '✨', 'Checks for ' + this.utils.style.b( userKeys.join( ', ' ) ) + ' passed successfully!' )

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
