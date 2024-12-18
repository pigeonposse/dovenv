import { Super } from './_super/main'

export class Custom extends Super {

	async #fn( pattern?: string[] ) {

		if ( !( await this.ensureOpts( {
			value : this.opts?.custom,
			name  : this.title + '.custom',
		} ) ) || !this.opts?.custom ) return

		const keys = this.getKeys( { pattern } )
		if ( !keys ) return

		for ( const key of keys ) {

			console.log( this.style.info.h( `Custom function for ${this.style.badge( key )} key` ) )
			const fn = this.opts.custom[key]
			await fn( {
				getPkgPaths   : this.getPkgPaths.bind( this ),
				getPkgManager : this.getPkgManager.bind( this ),
				getRuntime    : this.getRuntime.bind( this ),
			} )

		}

	}

	async run(  ) {

		return await this._envolvefn( this.#fn(  ) )

	}

}
