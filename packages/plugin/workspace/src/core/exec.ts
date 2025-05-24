import {
	open as _open,
	exec,
	getPaths,
	joinPath,
	removeDirIfExist,
} from '@dovenv/core/utils'

import { Super } from './_super/main'

export class Execute extends Super {

	#cmds = this.utils.packageManager.cmds

	// async #execConstructor( cmd: string ) {

	// 	try {

	// 		const {
	// 			stdout, stderr,
	// 		} = await execAsync( cmd, { cwd: this.utils.wsDir } )

	// 		return {
	// 			stderr : stderr.length ? stderr : undefined,
	// 			stdout : stdout.length ? stdout : undefined,
	// 		}

	// 	}
	// 	catch ( err: Any ) {

	// 		// THIS IS FOR PNPM

	// 		if ( err?.stdout || err?.stderr )
	// 			return {
	// 				stderr : err.stderr.length && typeof err.stderr === 'string' ? err.stderr as string : undefined,
	// 				stdout : err.stdout.length && typeof err.stdout === 'string' ? err.stdout as string : undefined,
	// 			}

	// 		return { stderr: err instanceof Error ? err.message : 'Unknown error' }

	// 	}

	// }

	async #exec( title: string, cmd: string ) {

		this._sectionTitle( title )
		const errors   = []
		const logError = console.error
		try {

			console.error = data => errors.push( data )
			await exec( cmd )

		}
		catch ( err ) {

			errors.push( err )

		}

		if ( errors.length ) {

			const mappedErrors = errors.map( e => {

				// this is for pnpm
				// @ts-ignore
				const isError = !!( e?.stdout || e?.stderr )
				if ( !isError ) return { isError }
				return {
					isError : true,
					error   : e instanceof Error ? e : new Error( 'Unknown error' ),
				}

			} )

			for ( const e of mappedErrors ) if ( e.isError ) console.error( e.error?.message )

		}
		console.error = logError

	}

	async #outdated() {

		await this.#exec( 'Packages outdated', this.#cmds.outdated )

	}

	async #audit() {

		await this.#exec( 'Audition', this.#cmds.audit )

	}

	async #auditFix() {

		await this.#exec( 'Fix Audition', this.#cmds.auditFix )

	}

	async #auditAndOutdated( fix?: boolean ) {

		if ( fix ) await this.#auditFix()
		else {

			await this.#audit()
			await this.#outdated()

			console.log( )
			console.log( this.utils.style.section.li( 'For fix audit use', `dovenv ws audit --fix | ${this.#cmds.auditFix}` ) )
			console.log( this.utils.style.section.li( 'For outdated dependencies use', this.#cmds.upDeps ) )
			console.log( )

		}

	}

	async #reinstall() {

		this._sectionTitle( 'Reinstall all workspace' )

		if ( this.opts?.reinstall?.hook?.before ) await this.opts.reinstall.hook.before()

		const paths = await getPaths( [ joinPath( this.utils.wsDir, '**/node_modules' ) ], {
			onlyDirectories : true,
			ignore          : [ '**/node_modules/**/node_modules' ],
		} )

		if ( paths ) await Promise.all( paths.map( async path => {

			console.info( `Removing ${path}` )
			await removeDirIfExist( path )

		} ) )

		await exec( this.utils.packageManager.cmds.install )

		if ( this.opts?.reinstall?.hook?.after ) await this.opts.reinstall.hook.after()

	}

	/**
	 * Reinstalls the workspace.
	 */
	async reinstall() {

		await this._envolvefn( this.#reinstall( ) )

	}

	/**
	 * Runs an audit on the current project to check for vulnerabilities
	 * and tries to fix them.
	 *
	 * @example
	 * const x = new Execute({ ... });
	 * await x.auditFix();
	 */
	async auditFix() {

		await this._envolvefn( this.#auditFix( ) )

	}

	/**
	 * Runs an audit on the current project to check for vulnerabilities.
	 * If issues are found, they will be displayed in the console.
	 * This function does not automatically fix the issues.
	 * Use `auditFix` for automatic fixing.
	 *
	 * @example
	 * const x = new Execute({ ... });
	 * await x.audit();
	 */
	async audit() {

		await this._envolvefn( this.#audit( ) )

	}

	/**
	 * Checks for outdated packages in the current project.
	 *
	 * @example
	 * const x = new Execute({ ... });
	 * await x.outdated();
	 */
	async outdated() {

		await this._envolvefn( this.#outdated( ) )

	}

	/**
	 * Run the audit and check outdated packages. If the `fix` property is set to true,
	 * the audit will be fixed.
	 *
	 * @param {boolean} [fix] - Whether to fix the audit automatically.
	 * @example
	 * const x = new Execute( { ... } )
	 * await x.auditAndOutdated()
	 * ...
	 * await x.auditAndOutdated( true )
	 */
	async auditAndOutdated( fix?: boolean ) {

		await this._envolvefn( this.#auditAndOutdated( fix ) )

	}

}
