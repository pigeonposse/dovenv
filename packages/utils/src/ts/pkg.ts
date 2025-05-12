/* eslint-disable @stylistic/object-curly-newline */
import { Prettify } from './super'

import type { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package'

export type PackageJSON = Prettify<JSONSchemaForNPMPackageJsonFiles & {
	/**
	 * The devEngines field aids engineers working on a codebase to all be using the same tooling.
	 *
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines
	 */
	devEngines? : {
		[key in 'cpu' | 'os' | 'libc' | 'runtime' | 'packageManager']? : {
			name     : string
			version? : string
			onFail?  : 'warn' | 'error' | 'ignore'
		}
	}
}>
