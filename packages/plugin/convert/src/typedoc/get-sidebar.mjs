import {
	joinPath,
	paths,
	readJSON, 
} from '@clippo/config/core'

import { utils } from './consts.mjs'

export const getSidebarUtils = async () => {

	const mainPkg = await readJSON( joinPath( paths.workspacePkg ) )
	const res     = [ {
		text : '👉 Index',
		link : joinPath( mainPkg.extra.docsPath.utils, 'index.md' ), 
	} ]
	for ( const util of utils ) {

		const pkg = await readJSON( joinPath( paths.utilsDir, util.id, 'package.json' ) )
		res.push( {
			text : pkg.extra.emoji + ' ' + pkg.extra.productName,
			link : joinPath( mainPkg.extra.docsPath.utils, util.id, 'index.md' ), 
		} )
	
	}

	return res

}
