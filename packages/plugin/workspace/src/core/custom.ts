import { Super } from './_super/main'

export class Custom extends Super {

	async #fn( pattern?: string[] ) {

		const keys = await this.utils.getOptsKeys( {
			input : this.opts?.custom,
			pattern,
			name  : this.utils.title + '.custom',
		} )
		if ( !keys || !this.opts?.custom ) return

		for ( const key of keys ) {

			console.log( this.utils.style.info.h( `Custom function for ${this.utils.style.badge( key )} key` ) )
			const fn = this.opts.custom[key]
			await fn( {
				getPkgPaths   : this.utils.getPkgPaths.bind( this ),
				getPkgManager : this.utils.getPkgManager.bind( this ),
				getRuntime    : this.utils.getRuntime.bind( this ),
			} )

		}

	}

	async run( ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
