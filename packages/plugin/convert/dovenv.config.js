import { defineConfig } from '@dovenv/core'

export default defineConfig( { check : { deps : {
	desc     : 'Avoid updating package dependencies',
	type     : 'file',
	patterns : [ 'package.json' ],
	validate : async ( {
		path, content,
	} ) => {

		if ( !content ) throw new Error( `File [${path}] must exist` )
		else if ( content === '' ) throw new Error( `File [${path}] is empty and must have content` )

		const pkg         = JSON.parse( content )
		const explanation = `Explanation:

It is necessary to keep these versions for the correct operation of the plugin.
Any update could break "TS2MD" and "TS2HTML`

		const pkgDeps = {
			typedoc : {
				name    : 'typedoc',
				version : '0.26.11',
			},
			typedocMd : {
				name    : 'typedoc-plugin-markdown',
				version : '4.2.10',
			},
		}
		if ( !pkg.dependencies[pkgDeps.typedoc.name] || !pkg.dependencies[pkgDeps.typedocMd.name] )
			throw new Error( `File [${path}] must have [${pkgDeps.typedoc.name}] and [${pkgDeps.typedocMd.name}]` )
		if ( pkg.dependencies[pkgDeps.typedoc.name] !== pkgDeps.typedoc.version || pkg.dependencies[pkgDeps.typedocMd.name] !== pkgDeps.typedocMd.version )
			throw new Error( `File [${path}] must have dependencies [${pkgDeps.typedoc.name}] and [${pkgDeps.typedocMd.name}] with version [${pkgDeps.typedoc.version}] and [${pkgDeps.typedocMd.version}]respectively.\n\n${explanation}` )

	},
} } } )
