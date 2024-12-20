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

		return await existsDir( joinPath( this.wsDir, '.git' ) )

	}

	async #askOrigin() {

		const repoId = this.pkg?.extra.repoId || this.pkg?.repoID || this.pkg?.name
		const owner  = this.pkg?.extra.collective.id
		const url    = repoId && owner ? `https://github.com/${owner}/${repoId}.git` : this.pkg?.reppsitory.url

		if ( !url ) throw new Error( 'Invalid repository url: ' + url )

		const value = await this.prompt.text( {
			message      : 'Write your origin git url',
			placeholder  : url,
			initialValue : url,
		} )

		if ( this.prompt.isCancel( value ) ) await this.onCancel()
		return value as string

	}

	async #askForExecution() {

		const value = await this.prompt.confirm( { message: 'Do you want to execute the command?' } )

		if ( this.prompt.isCancel( value ) ) await this.onCancel()
		return value as boolean

	}

	async #askBranch() {

		const initialValue = `main`

		const value = await this.prompt.text( {
			message      : 'Write your init branch',
			placeholder  : initialValue,
			initialValue : initialValue,
		} )

		if ( this.prompt.isCancel( value ) ) await this.onCancel()
		return value as string

	}

	async run( silent = false ) {

		const git = await this.isInit()

		if ( git ) {

			if ( silent ) return
			this.prompt.log.success( this.style.success.msg( 'Git is initialized ✨' ) )
			this.prompt.log.step( '' )
			return

		}

		this.prompt.log.info( this.style.p( 'Init your repository' ) )
		const addInstance    = new GitAdd( this.opts, this.config )
		const commitInstance = new GitCommit( this.opts, this.config )

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

		this.prompt.note( `Command to be executed:\n\n${cmd}` )
		const exexute = await this.#askForExecution()
		if ( exexute ) {

			console.log( this.style.info.hr( 'git init' ) )
			await exec( cmd )
			console.log( this.style.info.hr( ) )
			this.prompt.log.success( this.style.success.msg( 'Git is initialized ✨' ) )

		}
		else
			this.prompt.log.success( this.style.success.msg( 'Git init skipped from execution ✨' ) )

		this.prompt.log.step( '' )

	}

}
