import {
	open as _open,
	exec,
	getPaths,
	joinPath,
	onStd,
	removeDirIfExist,
} from '@dovenv/core/utils'

import { Super } from './_super/main'

export class Execute extends Super {

	// Method forremove errors from output
	output = onStd( {
		type : 'stderr',
		fn   : () => '',
	} )

	async #audit() {

		this._sectionTitle( 'Audition' )

		const cmd = this.getPkgManagerCmds()
		this.output.start()
		await exec( cmd.audit )
			.catch( () => '' )
		this.output.stop()

	}

	async #auditFix() {

		this._sectionTitle( 'Fix Audition' )

		const cmd = this.getPkgManagerCmds()

		this.output.start()
		await exec( cmd.auditFix )
			.catch( () => '' )
		this.output.stop()

	}

	async #outdated() {

		this._sectionTitle( 'Packages outdated' )

		const cmd = this.getPkgManagerCmds()

		this.output.start()
		await exec( cmd.outdated )
			.catch( () => '' )
		this.output.stop()

	}

	async #auditAndOutdated( fix?: boolean  ) {

		const cmd = this.getPkgManagerCmds()

		if ( fix ) await this.#auditFix()
		else {

			await this.#audit()
			await this.#outdated()

			console.log(  )
			console.log( this.style.section.li( 'For fix audit use', `dovenv ws audit --fix | ${cmd.auditFix}` ) )
			console.log( this.style.section.li( 'For outdated dependencies use', cmd.upDeps ) )
			console.log(  )

		}

	}

	async #reinstall() {

		this._sectionTitle( 'Reinstall all workspace' )

		if ( this.opts?.reinstall?.hook?.before ) await this.opts.reinstall.hook.before()

		const paths = await getPaths( [ joinPath( this.wsDir, '**/node_modules' ) ], {
			onlyDirectories : true,
			ignore          : [ '**/node_modules/**/node_modules' ],
		} )

		if ( paths ) for ( const path of paths ) {

			console.info( `Removing ${path}` )
			await removeDirIfExist( path )

		}

		const cmds = this.getPkgManagerCmds()
		// await exec( 'pnpm store prune' )
		// await exec( 'pnpm cache delete' )
		await exec( cmds.install  )

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
	 * @example
	 * const x = new Execute({ ... });
	 * await x.auditFix();
	 */
	async auditFix() {

		await this._envolvefn( this.#auditFix(  ) )

	}

	/**
	 * Runs an audit on the current project to check for vulnerabilities.
	 * If issues are found, they will be displayed in the console.
	 * This function does not automatically fix the issues.
	 * Use `auditFix` for automatic fixing.
	 * @example
	 * const x = new Execute({ ... });
	 * await x.audit();
	 */
	async audit() {

		await this._envolvefn( this.#audit(  ) )

	}

	/**
	 * Checks for outdated packages in the current project.
	 * @example
	 * const x = new Execute({ ... });
	 * await x.outdated();
	 */
	async outdated() {

		await this._envolvefn( this.#outdated(  ) )

	}

	/**
	 * Run the audit and check outdated packages. If the `fix` property is set to true,
	 * the audit will be fixed.
	 * @param {boolean} [fix] - Whether to fix the audit automatically.
	 * @example
	 * const x = new Execute( { ... } )
	 * await x.auditAndOutdated()
	 * ...
	 * await x.auditAndOutdated( true )
	 */
	async auditAndOutdated( fix?: boolean  ) {

		await this._envolvefn( this.#auditAndOutdated( fix ) )

	}

}
