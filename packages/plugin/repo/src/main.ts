import {
	defineConfig,
	type Config as DoveEnvConfig,
} from 'dovenv'

import { config as contributorsConfig } from './contributors/main'
import { config as ghConfig }           from './gh/main'
import { config as gitConfig }          from './git/main'
import { config as updateConfig }       from './update/main'

import type { Config as GeneralConfig }      from './_super/types'
import type { Role }                         from './contributors/fn'
import type { Config as ContributorsConfig } from './contributors/main'
import type { GitConfig }                    from './git/main'

type Config<I extends string, R extends Role<I>> = GeneralConfig & GitConfig & {
	contributors?  : ContributorsConfig<I, R>
	updateVersion? : Parameters<typeof updateConfig>[0]
}

export const config = <Contr extends string, R extends Role<Contr>>( opts?: Config<Contr, R> ): DoveEnvConfig => {

	const {
		contributors, updateVersion, ...generalConf
	} = opts || {}

	return defineConfig( [
		contributorsConfig( contributors ),
		ghConfig( generalConf ),
		gitConfig( generalConf ),
		updateConfig( updateVersion ),
	] )

}

