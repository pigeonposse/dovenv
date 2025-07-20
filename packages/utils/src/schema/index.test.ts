import {
	describe,
	it,
} from 'vitest'

describe( 'Schema utilities', () => {

	it( 'should execute "index" without errors', async () => {

		await import( './index.example' )

	} )

} )
