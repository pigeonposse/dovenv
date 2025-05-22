/* eslint-disable @stylistic/object-curly-newline */

import { defineConfig } from '@dovenv/core'

import { contributorsPlugin } from './contributors/plugin'
import { ghPlugin }           from './gh'
import { gitPlugin }          from './git'
import { pkgPlugin }          from './pkg'

import type { ConfigSuper,
	DovenvConfig } from './_super/types'
import type {
	Role,
	ContributorsConfig,
} from './contributors/types'
import type { GitConfig } from './git/types'

type Config<R extends Role> = ConfigSuper & GitConfig & {
	/** Contributors configuration */
	contributors? : ContributorsConfig<R>
}

/**
 * Dovenv plugin for managing a repository.
 *
 * @param   {Config}       opts - Optional configuration.
 * @returns {DovenvConfig}      - The plugin configuration.
 */
const repoPlugin = <R extends Role = Role>( opts?: Config<R> ): DovenvConfig => {

	const {
		contributors,
		...generalConf
	} = opts || {}

	return defineConfig( [
		contributorsPlugin( contributors ),
		ghPlugin( generalConf ),
		gitPlugin( generalConf ),
		pkgPlugin( generalConf ),
	] )

}

export { repoPlugin }
export default repoPlugin
export type { Config }
