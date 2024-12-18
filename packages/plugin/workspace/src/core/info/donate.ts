import { open as _open } from '@dovenv/core/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

export class Donate extends Super implements InfoInterface {

	async get() {

		const url = typeof this.pkg?.funding === 'string'
			? this.pkg.funding
			: Array.isArray( this.pkg?.funding )
				? ( typeof this.pkg.funding[0] === 'string'
					? this.pkg.funding[0]
					: this.pkg.funding[0]?.url || undefined )
				: typeof this.pkg?.funding === 'object' && typeof this.pkg.funding?.url === 'string'
					? this.pkg.funding.url
					: undefined
		return url

	}

	async #fn( open: boolean ) {

		const url = await this.get()

		if ( open && url ) await _open( url )

		this._title( 'Donate information' )

		console.log( url
			? this.style.section.a( url )
			: this.style.section.p( 'There is no funding URL associated with this package' ),
		)

	}

	async run( open = true ) {

		return await this._envolvefn( this.#fn( open ) )

	}

}
