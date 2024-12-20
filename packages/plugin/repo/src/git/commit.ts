/**
 * see: https://github.com/commitizen/cz-cli?tab=readme-ov-file#1-create-your-own-entry-point-script
 */

import {
	execChild,
	exec,
} from '@dovenv/core/utils'

import { GitSuper } from './_super'

type Commit = Exclude<NonNullable<GitCommit['opts']>['commit'], undefined>
export class GitCommit extends GitSuper {

	types: Commit['types'] = [
		{
			value : ':sparkles: feat',
			title : '✨ feat',
			desc  : 'Adding a new feature',
		},
		{
			value : ':bug: fix',
			title : '🐛 fix',
			desc  : 'Fixing a bug',
		},
		{
			value : ':memo: docs',
			title : '📝 docs',
			desc  : 'Add or update documentation',
		},
		{
			value : ':lipstick: style',
			title : '💄 style',
			desc  : 'Add or update styles, UI, or UX',
		},
		{
			value : ':recycle: refactor',
			title : '♻️  refactor',
			desc  : 'Code change that neither fixes a bug nor adds a feature',
		},
		{
			value : ':zap: perf',
			title : '⚡️ perf',
			desc  : 'Code change that improves performance',
		},
		{
			value : ':white_check_mark: test',
			title : '✅ test',
			desc  : 'Adding test cases',
		},
		{
			value : ':truck: chore',
			title : '🚚 chore',
			desc  : 'Changes to the build process or auxiliary tools and libraries (e.g., documentation generation)',
		},
		{
			value : ':rewind: revert',
			title : '⏪️ revert',
			desc  : 'Revert to a previous commit',
		},
		{
			value : ':construction: wip',
			title : '🚧 wip',
			desc  : 'Work in progress',
		},
		{
			value : ':construction_worker: build',
			title : '👷 build',
			desc  : 'Add or update related to build process',
		},
		{
			value : ':green_heart: ci',
			title : '💚 ci',
			desc  : 'Add or update related to CI process',
		},
	]

	scopes: Commit['scopes'] = [
		{
			value : 'core',
			desc  : 'Core functionality of the application',
		},
		{
			value : 'env',
			desc  : 'Reference for workspace environment',
		},
		{
			value : 'all',
			desc  : 'Reference all changes affecting multiple scopes',
		},
	]

	async getStagedFiles() {

		const { stdout } = await execChild( 'git status --short' )
		return ' ' + stdout.trim()

	}

	/**
	 * Get list of staged files.
	 * @returns {Promise<string[]>} List of staged files
	 */
	async getStagedFilesList() {

		const res = await this.getStagedFiles()
		return res.split( '\n' )

	}

	/**
	 * Get the last commit message.
	 * @returns {Promise<string>} The last commit message.
	 */
	async getLastCommit() {

		const { stdout } = await execChild( 'git log -1 --pretty=%B' )
		return stdout.trim()

	}

	async isStageEmpty() {

		const { stdout } = await execChild( 'git diff --cached' )
		return ( stdout === '' )

	}

	async exec( message: string ) {

		const cmd = `git commit -m "${message}"`

		console.log( this.style.info.hr( 'git commit' ) )
		await exec( cmd )
		console.log( this.style.info.hr(  ) )

	}

	async ask( execute = true ) {

		const types       = this.opts?.commit?.types || this.types as GitCommit['types']
		const scopes      = this.opts?.commit?.scopes || this.scopes as GitCommit['scopes']
		const data        = {
			type  : 'type',
			scope : 'scope',
			msg   : 'message',
		} as const
		const defaultData = {
			[data.type]  : undefined as string | undefined,
			[data.scope] : undefined as string | undefined,
			[data.msg]   : '',
		}
		const cache       = await this.cache( 'commit', defaultData )
		const cached      = await cache.get()

		const res = await this.promptGroup( {
			onCancel : async () => this.onCancel(),
			list     : async p => {

				const prompt = {
					type : async () => {

						const result = ( types )
							? await p.select( {
								message : 'Select type of commit',
								options : types.map( t => ( {
									value : t.value,
									label : t.title || t.value,
									hint  : t.desc,
								} ) ),
								initialValue : types.some( t => t.value === cached[data.type] ) ? cached[data.type] : undefined,
							} ) as string
							: undefined
						cache.set( { [data.type]: result } )
						return result

					},
					scope : async () => {

						const result = ( scopes )
							? await p.select( {
								message : 'Select scope of commit',
								options : scopes.map( t => ( {
									value : t.value,
									label : t.title || t.value,
									hint  : t.desc,
								} ) ),
								initialValue : scopes.some( t => t.value === cached[data.scope] ) ? cached[data.scope] : undefined,
							} ) as string
							: undefined

						cache.set( { [data.scope]: result } )
						return result

					},
					message : async () => {

						const result = await p.text( {
							message     : 'Commit message',
							placeholder : cache.get( data.msg ),
							validate    : ( msg: string ) => {

								if ( !msg.trim() ) return 'Commit message is required'

							},
							// Disabled because it's for better user experience
							//initialValue : cache.get( data.msg ),
						} ) as string

						cache.set( { [data.msg]: result } )
						return result

					},
				}

				return {
					desc   : () => p.log.info( this.style.p( 'Prompt for commit message' ) ),
					...prompt,
					commit : async ( { results } ) => {

						// @ts-ignore
						const msg = results.message as string
						// @ts-ignore
						const scope = results.scope as string
						// @ts-ignore
						const type   = results.type as string
						const setMsg = () => {

							if ( !msg ) return
							else if ( !scope && !type ) return msg
							else if ( !scope ) return `${type}: ${msg}`
							else if ( !type ) return `${scope}: ${msg}`
							else return `${type}(${scope}): ${msg}`

						}
						try {

							const message = setMsg()

							if ( !message ) {

								console.warn( 'Unexpected: Commit message is not defined' )
								return

							}
							p.log.info( this.style.info.msg( 'Total message', message ) )

							// setLine( 'Lint' )
							// await this.lint( message )
							if ( execute ) await this.exec( message )
							return message

						}
						catch ( e ) {

							if ( e instanceof Error ) p.log.error( e.message )
							else console.error( e )

							await this.onCancel()

						}

					},
				}

			},
		} )

		console.debug( { 'commit-results': res } )
		// @ts-ignore
		return res.commit as string

	}

	async run( ) {

		await this.init()

		const isEmpty = await this.isStageEmpty()
		if ( !isEmpty ) return await this.ask()

		console.warn(
			`Nothing to commit.\n\nStage your changes executing: ${this.style.badge( 'dovenv git push' )}\nOr stage your changes manually using ${this.style.badge( 'git add' )} and executing again: ${this.style.badge( 'dovenv git commit' )}`,
		)
		return

	}

}

