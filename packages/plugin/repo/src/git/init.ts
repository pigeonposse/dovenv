import {
	existsDir,
	joinPath,
} from '@dovenv/core/utils'
import { exec } from 'child_process'

import { GitSuper } from './_super'
import {
	GitAdd,
	GitCommit,
} from '../git/main'

export class GitInit extends GitSuper {

	async isInit() {

		return await existsDir( joinPath( this.utils.wsDir, '.git' ) )

	}

	async #askOrigin() {

		const repoId = this.utils.pkg?.extra.repoId || this.utils.pkg?.repoID || this.utils.pkg?.name
		const owner  = this.utils.pkg?.extra.collective.id
		const url    = repoId && owner ? `https://github.com/${owner}/${repoId}.git` : this.utils.pkg?.reppsitory.url

		if ( !url ) throw new Error( 'Invalid repository url: ' + url )

		const value = await this.utils.prompt.text( {
			message      : 'Write your origin git url',
			placeholder  : url,
			initialValue : url,
		} )

		if ( this.utils.prompt.isCancel( value ) ) await this.utils.onCancel()
		return value as string

	}

	async #askForExecution() {

		const value = await this.utils.prompt.confirm( { message: 'Do you want to execute the command?' } )

		if ( this.utils.prompt.isCancel( value ) ) await this.utils.onCancel()
		return value as boolean

	}

	async #askBranch() {

		const initialValue = `main`

		const value = await this.utils.prompt.text( {
			message      : 'Write your init branch',
			placeholder  : initialValue,
			initialValue : initialValue,
		} )

		if ( this.utils.prompt.isCancel( value ) ) await this.utils.onCancel()
		return value as string

	}

	async run( silent = false ) {

		const git = await this.isInit()

		if ( git ) {

			if ( silent ) return
			this.utils.prompt.log.success( this.utils.style.success.msg( 'Git is initialized ✨' ) )
			this.utils.prompt.log.step( '' )
			return

		}

		this.utils.prompt.log.info( this.utils.style.p( 'Init your repository' ) )
		const addInstance    = new GitAdd( {
			opts  : this.opts,
			utils : this.utils,
		} )
		const commitInstance = new GitCommit( {
			opts  : this.opts,
			utils : this.utils,
		}  )

		const add    = await addInstance.ask()
		const commit = await commitInstance.ask( false )
		const branch = await this.#askBranch()
		const origin = await this.#askOrigin()

		const cmd = `git init &&
git add ${add} &&
git commit -m "${commit}" &&
git branch -M ${branch} &&
git remote add origin ${origin} &&
git push -u origin ${branch}`

		this.utils.prompt.note( `Command to be executed:\n\n${cmd}` )
		const exexute = await this.#askForExecution()
		if ( exexute ) {

			console.log( this.utils.style.info.hr( 'git init' ) )
			await exec( cmd )
			console.log( this.utils.style.info.hr( ) )
			this.utils.prompt.log.success( this.utils.style.success.msg( 'Git is initialized ✨' ) )

		}
		else
			this.utils.prompt.log.success( this.utils.style.success.msg( 'Git init skipped from execution ✨' ) )

		this.utils.prompt.log.step( '' )

	}

}
