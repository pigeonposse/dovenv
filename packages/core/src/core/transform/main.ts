
import {
	readFile,
	writeFileContent,
} from '@dovenv/utils'

import { schema }          from './schema'
import { TransformConfig } from './types'
import { Command }         from '../_shared/main'

import type { ArgvParsed } from '../../_shared/types'

export class Transform extends Command<TransformConfig> {

	argv
	load

	constructor( argv : ArgvParsed ) {

		super( argv.utils.config?.transform, argv.utils )

		this.argv        = argv
		this.utils.title = 'transform'
		this.schema      = schema( this.utils.validate ).optional()
		this.load        = this.utils.spinner()

	}

	async #set() {

		const props = this.opts || {}

		const userKeys = this.getKeysFromArgv( Object.keys( props ), this.argv )
		if ( !userKeys || !userKeys.length ) return

		for ( const key of userKeys ) {

			this.load.start( this.utils.style.info.msg( key, 'Transforming...' ) )

			try {

				const prop = props[key]

				if ( !prop.input ) throw new Error( `No inputs provided` )
				const inputs = await this.utils.getPaths( prop.input, {
					onlyFiles : true,
					dot       : true,
				} )
				if ( !inputs.length ) throw new Error( `inputs [${prop.input.join( ', ' )}] do not exist` )

				for ( const i of inputs ) {

					const content = await readFile( i, 'utf8' )
					if ( !prop.fn ) continue

					const newContent = await prop.fn( {
						path    : i,
						content : content,
						utils   : this.utils,
					} )
					if ( !newContent ) continue
					await writeFileContent( i, newContent )
					this.load.text = this.utils.style.info.msg( key, `[${i}] successfully transformed` )

				}
				this.load.succeed( this.utils.style.success.msg( key, 'Inputs successfully transformed' ) )

			}
			catch ( e ) {

				this.load.fail( this.utils.style.error.msg( key, 'Transformation failed. ' + ( e instanceof Error ? e.message : JSON.stringify( e ) ) ) )

				this.utils.exitWithError()

			}

		}

	}

	async #fn() {

		if ( !( await this.utils.ensureOpts( { input: this.opts } ) ) ) return

		await this.validateSchema( this.opts )
		await this.#set()

	}

	async run( ) {

		return await this.utils.catchFn( this.#fn( ) )

	}

}
