/* eslint-disable @stylistic/object-curly-newline */
import {
	defineConfig,
	type Config as DovenvConfig,
} from '@dovenv/core'

import { type Role }          from './contributors/fn'
import { contributorsPlugin } from './contributors/main'
import { ghPlugin }           from './gh/main'
import { gitPlugin }          from './git/main'
import { pkgPlugin }          from './pkg/main'

import type { Config as RepoConfig } from './_super/types'
import type { ContributorsConfig }   from './contributors/main'
import type { GitConfig }            from './git/types'

export * from './pkg/main'
export * from './git/main'
export * from './gh/main'
export * from './contributors/main'

export type Config<I extends string, R extends Role<I>> = RepoConfig & GitConfig & {
	/** Contributors configuration */
	contributors? : ContributorsConfig<I, R>
}

/**
 * Dovenv plugin for managing a repository.
 * @param {Config} opts - Optional configuration.
 * @returns {DovenvConfig} - The plugin configuration.
 */
export const repoPlugin = <Contr extends string, R extends Role<Contr>>( opts?: Config<Contr, R> ): DovenvConfig => {

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

export default repoPlugin
