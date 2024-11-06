/* eslint-disable @stylistic/object-curly-newline */
import {
	defineConfig,
	type Config as DoveEnvConfig,
} from 'dovenv'

import { config as contributorsConfig } from './contributors/main'
import { config as ghConfig }           from './gh/main'
import { config as gitConfig }          from './git/main'
import { config as pkgConfig }          from './pkg/main'

import type { Config as GeneralConfig }      from './_super/types'
import type { Role }                         from './contributors/fn'
import type { Config as ContributorsConfig } from './contributors/main'
import type { GitConfig }                    from './git/types'

type Config<I extends string, R extends Role<I>> = GeneralConfig & GitConfig & {
	/** Contributors configuration */
	contributors? : ContributorsConfig<I, R> }

export const config = <Contr extends string, R extends Role<Contr>>( opts?: Config<Contr, R> ): DoveEnvConfig => {

	const {
		contributors,
		...generalConf
	} = opts || {}

	return defineConfig( [
		contributorsConfig( contributors ),
		ghConfig( generalConf ),
		gitConfig( generalConf ),
		pkgConfig( generalConf ),
	] )

}

