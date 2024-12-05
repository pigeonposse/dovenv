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

	line( title?: string ) {

		const l = `${line( {
			title    : '',
			lineChar : this._color.dim( icon.line ),
		} )}\n`

		return {
			start : () => {

				console.log(
					title
						? line( {
							title    : this._color.dim( title ),
							lineChar : ' ',
						} )
						: '' + '\n' + l,
				)

			},
			stop : () => {

				console.log( +'\n' + l )

			},
		}

	}

}
