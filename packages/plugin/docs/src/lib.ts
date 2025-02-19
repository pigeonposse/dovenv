import { getCommandUtils } from '@dovenv/core'

import { DocsCore } from './core/main'

import type { DocsParams } from './core/types'

export const docs = async ( args?: Omit<DocsParams, 'utils'>, utils?: Parameters<typeof getCommandUtils>[0]  ) => {

	const core = new DocsCore( {
		...args,
		utils : await getCommandUtils( utils ),
	} )
	return core

}
