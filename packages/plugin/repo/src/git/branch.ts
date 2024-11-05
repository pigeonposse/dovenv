import {
	execChild,
	icon,
} from '@dovenv/utils'

import { Git } from './super'

export class RepoBranch extends Git {

	async #askSelectBranch(): Promise<string> {

		const all         = await this.getAll()
		const res         = await this.prompt.select( {
			message : 'Select branch of your repo',
			options : all.map( b => ( {
				value : b,
				label : b,
			} ) ),
		} )
		const isCancelled = this.prompt.isCancel( res )
		if ( isCancelled ) {

			this.prompt.cancel( 'Cancelled 💔' )
			this.process.exit( 0 )

		}
		else if ( !res || typeof res !== 'string' ) throw new Error( 'Unexpected error: No branch selected' )

		return res as string

	}

	async #askCreate(): Promise<string> {

		const res         = await this.prompt.text( { message: 'Set new branch name' } )
		const isCancelled = this.prompt.isCancel( res )
		if ( isCancelled ) {

			this.prompt.cancel( 'Cancelled 💔' )
			this.process.exit( 0 )

		}
		else if ( !res || typeof res !== 'string' ) throw new Error( 'Unexpected error: No branch selected' )

		return res as string

	}

	/**
	 * Get the current branch name.
	 * @returns {Promise<string>} - The name of the current branch.
	 */
	async getCurrent() {

		const { stdout } = await execChild( 'git branch --show-current	' )

		return stdout

	}

	/**
	 * Shows the current branch name.
	 * @returns {Promise<void>}
	 */
	async showCurrent() {

		const res = await this.getCurrent()
		this.prompt.note(  this.color.cyan( icon.dot ) + ' ' + res, 'Current branch' )
		this.prompt.log.step( '' )

	}

	/**
	 * Get all branches in the repository.
	 * @param {boolean} remote - If true, shows remote branches as well.
	 * @returns {Promise<string[]>} - An array of branch names.
	 */
	async getAll( remote = true ): Promise<string[]> {

		const command    = remote ? 'git branch -a' : 'git branch'
		const { stdout } = await execChild( command )
		return stdout
			.split( '\n' )
			.map( branch => branch.replace( /[*\s]/g, '' ).trim() )
			.filter( branch => branch.length > 0 )

	}

	/**
	 * Show all branches in the repository.
	 * @param {boolean} remote - If true, shows remote branches as well.
	 * @returns {Promise<void>}
	 */
	async showAll( remote = true ) {

		const res     = await this.getAll( remote )
		const content = res.map( b => ( this.color.cyan( icon.dot ) + ' ' + b ) ).join( '\n' )
		this.prompt.note(  content, 'All branches' )
		this.prompt.log.step( '' )

	}

	/**
	 * Change to a specified branch.
	 * @param {string} branchName - The name of the branch to switch to.
	 * @param {boolean} force - If true, force switches to the branch, discarding local changes.
	 * @returns {Promise<void>}
	 */
	async change( branchName?: string, force = false ): Promise<void> {

		const branch  = ( !branchName ) ? await this.#askSelectBranch() : branchName
		const command = force ? `git checkout -f ${branch}` : `git checkout ${branch}`

		const {
			stdout, stderr,
		} = await execChild( command )
		if ( stderr ) throw new Error( `Error changing branch: ${stderr}` )
		console.log( `Switched to branch: ${stdout.trim()}` )

	}

	/**
	 * Switch to an existing branch.
	 * @param {string} [branchName] - The name of the branch to switch to.
	 * @returns {Promise<void>}
	 */
	async switch( branchName?: string ): Promise<void> {

		const branch     = ( !branchName ) ? await this.#askSelectBranch() : branchName
		const { stderr } = await execChild( `git switch ${branch}` )
		if ( stderr ) {

			throw new Error( `Error switching to branch: ${stderr}` )

		}
		console.log( `Switched to branch: ${branch}` )

	}

	/**
	 * Create a new branch without switching to it.
	 * @param {string} [branchName] - The name of the branch to create.
	 * @returns {Promise<void>}
	 */
	async create( branchName?: string ): Promise<void> {

		const branch     = ( !branchName ) ? await this.#askCreate() : branchName
		const { stderr } = await execChild( `git branch ${branch}` )
		if ( stderr ) {

			throw new Error( `Error creating branch: ${stderr}` )

		}
		console.log( `Created branch: ${branch}` )

	}

	/**
	 * Create a new branch and switch to it.
	 * @param {string} [branchName] - The name of the branch to create and switch to.
	 * @returns {Promise<void>}
	 */
	async createAndSwitch( branchName?: string ): Promise<void> {

		const branch     = ( !branchName ) ? await this.#askCreate() : branchName
		const { stderr } = await execChild( `git checkout -b ${branch}` )
		if ( stderr ) {

			throw new Error( `Error creating and switching to branch: ${stderr}` )

		}
		console.log( `Created and switched to branch: ${branch}` )

	}

	/**
	 * Delete a branch.
	 * @param {string} [branchName] - The name of the branch to delete.
	 * @param {boolean} force - If true, forces deletion of the branch.
	 * @returns {Promise<void>}
	 */
	async delete( branchName?: string, force = false ): Promise<void> {

		const branch     = ( !branchName ) ? await this.#askSelectBranch() : branchName
		const command    = force ? `git branch -D ${branch}` : `git branch -d ${branch}`
		const { stderr } = await execChild( command )
		if ( stderr ) {

			throw new Error( `Error deleting branch: ${stderr}` )

		}
		console.log( `Deleted branch: ${branch}` )

	}

}
