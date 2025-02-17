import { open as _open } from '@dovenv/core/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

export class Donate extends Super implements InfoInterface {

	async get() {

		const url = typeof this.utils.pkg?.funding === 'string'
			? this.utils.pkg.funding
			: Array.isArray( this.utils.pkg?.funding )
				? ( typeof this.utils.pkg.funding[0] === 'string'
					? this.utils.pkg.funding[0]
					: this.utils.pkg.funding[0]?.url || undefined )
				: typeof this.utils.pkg?.funding === 'object' && typeof this.utils.pkg.funding?.url === 'string'
					? this.utils.pkg.funding.url
					: undefined
		return url

	}

	async #fn( open: boolean ) {

		const url = await this.get()

		if ( open && url ) await _open( url )

		this._title( 'Donate information' )

		console.log( url
			? this.utils.style.section.a( url )
			: this.utils.style.section.p( 'There is no funding URL associated with this package' ),
		)

	}

	async run( open = true ) {

		return await this._envolvefn( this.#fn( open ) )

	}

}
