import {
	open as _open,
	exec,
	getPaths,
	joinPath,
	onStd,
	removeDirIfExist,
} from '@dovenv/utils'

import { Super } from './_super/main'

export class Execute extends Super {

	manager : ReturnType<Super['_getPkgManager']> | undefined

	// Method forremove errors from output
	output = onStd( {
		type : 'stderr',
		fn   : () => '',
	} )

	#getPkgManager() {

		if ( this.manager ) return this.manager
		return this.manager = this._getPkgManager()

	}

	async #audit() {

		this._sectionTitle( 'Audition' )

		const pkgManager = this.#getPkgManager()
		const cmds       = this._cmdsList
		this.output.start()
		await exec( cmds[pkgManager].audit )
			.catch( () => '' )
		this.output.stop()

	}

	async #auditFix() {

		this._sectionTitle( 'Fix Audition' )

		const pkgManager = this.#getPkgManager()
		const cmds       = this._cmdsList

		this.output.start()
		await exec( cmds[pkgManager].auditFix )
			.catch( () => '' )
		this.output.stop()

	}

	async #outdated() {

		this._sectionTitle( 'Packages outdated' )
		const pkgManager = this.#getPkgManager()
		const cmds       = this._cmdsList

		this.output.start()
		await exec( cmds[pkgManager].outdated )
			.catch( () => '' )
		this.output.stop()

	}

	async #runPkg( pkgName: string, opts?: string[] ) {

		this._title( 'Run package' )

		if ( !pkgName || pkgName === '' ) {

			console.warn( 'No package provided' )
			return

		}
		const manager = this._getPkgManager()
		await exec( this._cmdsList[manager].exec + ' ' + pkgName + ( opts && opts.length ? ' ' + opts.join( ' ' ) : '' ) )

	}

	async #auditAndOutdated( fix?: boolean  ) {

		const pkgManager = this._getPkgManager()
		const cmds       = this._cmdsList

		if ( fix ) await this.#auditFix()
		else {

			await this.#audit()
			await this.#outdated()

			console.log(  )
			this._sectionInfo( 'For fix audit use', 'dovenv audit --fix' )
			this._sectionInfo( 'For outdated dependencies use', cmds[pkgManager].upDeps )
			console.log(  )

		}

	}

	async #reinstall() {

		this._sectionTitle( 'Reinstall all workspace' )

		if ( this.config?.reinstall?.hook?.before ) await this.config?.reinstall?.hook?.before()

		const paths = await getPaths( [ joinPath( this.wsDir, '**/node_modules' ) ], {
			onlyDirectories : true,
			ignore          : [ '**/node_modules/**/node_modules' ],
		} )

		if ( paths ) for ( const path of paths ) {

			console.info( `Removing ${path}` )
			await removeDirIfExist( path )

		}
		const pkgManager = this._getPkgManager()
		const cmds       = this._cmdsList
		// await exec( 'pnpm store prune' )
		// await exec( 'pnpm cache delete' )
		await exec( cmds[pkgManager].install  )

		if ( this.config?.reinstall?.hook?.after ) await this.config?.reinstall?.hook?.after()

	}

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
	 * Fetches a package from the registry without installing it as a dependency
	 * @param {string} pkgName - The name of the package
	 * @param {string[]} [opts] - An array of options
	 * @example
	 * const x = new Execute( { ... } )
	 *
	 * await x.runPkg( 'unbuild')
	 * ...
	 * await x.runPkg( 'binarium', ['--config', 'binarium.config.js'] )
	 */
	async runPkg( pkgName: string, opts?: string[] ) {

		await this._envolvefn( this.#runPkg( pkgName, opts ) )

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
