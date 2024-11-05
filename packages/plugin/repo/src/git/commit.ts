/**
 * see: https://github.com/commitizen/cz-cli?tab=readme-ov-file#1-create-your-own-entry-point-script
 */

import {
	execChild,
	exec,
	getModulePath,
	getCurrentDir,
	joinPath,
} from '@dovenv/utils'
// @ts-ignore
import cz       from 'commitizen/dist/cli/git-cz'
import inquirer from 'inquirer'

import { Repo } from '../_super/main'

export type CommitConfig = {
	/**
	 * Commit opts
	 * @see https://github.com/leoforfree/cz-customizable?tab=readme-ov-file#options
	 */
	config : Record<string, string> }

export class RepoCommit extends Repo {

	async isStageEmpty() {

		const { stdout } = await execChild( 'git diff --cached' )
		return ( stdout === '' )

	}

	async exec( message: string ) {

		await exec( `git commit -m "${message}"` )

	}

	async prompt() {

		const cliPath    = await getModulePath( {
			currentPath : import.meta.url,
			moduleEntry : 'cz-customizable',
		} )
		const configPath = joinPath( getCurrentDir( import.meta.url ), 'cz-config.mjs' )

		console.debug( {
			cliPath,
			configPath,
		} )

		cz.bootstrap( {
			cliPath,
			// this is new

			config : { path: configPath },
		} )

	}

	async run( ) {

		const isEmpty = await this.isStageEmpty()
		if ( isEmpty ) {

			console.warn(
				`Nothing to commit. Stage your changes via "git add" execute "commit" again`,
			)
			return

		}
		await this.prompt()

	}

}

