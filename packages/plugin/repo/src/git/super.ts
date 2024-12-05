import {
	execChild,
	icon,
	line,
} from '@dovenv/core/utils'

import { Repo } from '../_super/main'

import type { GitConfig } from './types'

export class GitSuper extends Repo {

	opts : GitConfig
	constructor( opts?: GitConfig, config?: Repo['config'] ) {

		super( opts, config )
		this.opts = opts || {}

	}

	async getGitRemoteURL() {

		return this.opts.repoURL || ( await execChild( 'git remote get-url origin' ) ).stdout || undefined

	}

	async onCancel() {

		this._prompt.log.step( '' )
		this._prompt.cancel( 'Process cancelled 💔' )

		process.exit( 0 )

	}

	line( title?: string ) {

		const l = `${line( {
			title    : '',
			lineChar : this._color.dim( icon.line ),
		} )}\n`

		return {
			start : () => {

				if ( title )
					console.log( '\n' + line( {
						title    : this._color.dim( title ),
						lineChar : ' ',
					} ) + '' + '\n' + l,
					)
				else console.log(  '\n' + l )

			},
			stop : () => {

				console.log( '\n' + l )

			},
		}

	}

}
