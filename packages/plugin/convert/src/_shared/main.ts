
import {
	ensureDir,
	getRandomUUID,
	getStringsFrom,
	getTempDir,
	joinPath,
	removeDirIfExist,
	writeFileContent,
} from '@dovenv/core/utils'

import type { ConvertPropsSuper } from './types'

export class ConvertSuper<Props extends ConvertPropsSuper> {

	props : Props

	constructor( props: Props ) {

		this.props = props

	}

	protected async _getContent( input: string[] | string ) {

		return await getStringsFrom(
			typeof input === 'string'
				? [ input ]
				: input,
		)

	}

	protected async _forEachContent( input: string[] | string, cb: ( data: Awaited<ReturnType<typeof getStringsFrom>>[number] ) => Promise<void> ) {

		const inputs = await this._getContent( input )

		await Promise.all( inputs.map( async i => await cb( i ) ) )

	}

	protected async _writeOutput( out: string, id: string, content: string ) {

		await ensureDir( out )
		await writeFileContent(
			joinPath( out, id ),
			content,
		)

	}

	protected async _getOutput( ) {

		// import be custom folder inside tempr dir, for then remove it
		const tempDir = joinPath( getTempDir(), 'dovenv-convert', getRandomUUID() )

		const dir = this.props.output ? this.props.output : tempDir

		await ensureDir( dir )

		return {
			dir,
			rmTempIfExist : async () => {

				if ( !this.props.output )
					await removeDirIfExist( tempDir )

			},
		}

	}

}
