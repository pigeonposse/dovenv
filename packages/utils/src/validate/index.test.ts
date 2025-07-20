import {
	describe,
	it,
} from 'vitest'

describe( 'Validate utilities', () => {

	it( 'should execute "index" without errors', async () => {

		await import( './index.example' )

	} )

} )
