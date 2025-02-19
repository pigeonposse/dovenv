
import * as convert          from '@dovenv/convert'
import { defineConfig }      from '@dovenv/core'
import { createMergeDataFn } from '@dovenv/core/utils'
import * as docs             from '@dovenv/docs'
import * as examples         from '@dovenv/examples'
import * as lint             from '@dovenv/lint'
import * as repo             from '@dovenv/repo'
import * as templates        from '@dovenv/templates'
import * as todo             from '@dovenv/todo'
import * as workspace        from '@dovenv/workspace'

export {
	convert,
	docs,
	examples,
	lint,
	repo,
	todo,
	workspace,
	templates,
}

export type Config = {
	/**
	 * Lint configuration.
	 * @see https://dovenv.pigeonposse.com/guide/plugin/lint
	 * @see https://www.npmjs.com/package/@dovenv/lint
	 */
	lint?      : lint.Config
	/**
	 * Documentation configuration.
	 * @see https://dovenv.pigeonposse.com/guide/plugin/docs
	 * @see https://www.npmjs.com/package/@dovenv/docs
	 */
	docs?      : docs.Config
	/**
	 * Convert configuration.
	 * @see https://dovenv.pigeonposse.com/guide/plugin/convert
	 * @see https://www.npmjs.com/package/@dovenv/convert
	 */
	convert?   : convert.Config
	/**
	 * To-Do configuration.
	 * @see https://dovenv.pigeonposse.com/guide/plugin/todo
	 * @see https://www.npmjs.com/package/@dovenv/todo
	 */
	todo?      : todo.Config
	/**
	 * Examples configuration.
	 * @see https://dovenv.pigeonposse.com/guide/plugin/examples
	 * @see https://www.npmjs.com/package/@dovenv/examples
	 */
	examples?  : examples.Config
	/**
	 * Templates configuration.
	 * @see https://dovenv.pigeonposse.com/guide/plugin/templates
	 * @see https://www.npmjs.com/package/@dovenv/templates
	 */
	templates? : templates.Config
	/**
	 * Workspace configuration.
	 * @see https://dovenv.pigeonposse.com/guide/plugin/workspace
	 * @see https://www.npmjs.com/package/@dovenv/workspace
	 */
	workspace? : workspace.Config
	/**
	 * Repository configuration.
	 * @see https://dovenv.pigeonposse.com/guide/plugin/repo
	 * @see https://www.npmjs.com/package/@dovenv/repo
	 */
	repo?      : Parameters<typeof repo.default>[0]
}

/**
 * Merges multiple `banda-theme` configuration objects into a single configuration.
 */
export const mergeConfig = createMergeDataFn<Config>(  )

/**
 * Banda theme configuration for `dovenv`.
 *
 * This function takes an optional object with keys matching the plugin names
 * and values that are the respective plugin's configuration objects.
 * @param {Config} opts - Optional configuration options.
 * @returns {import('@dovenv/core').Config} The `dovenv` configuration object.
 * @example
 * import { bandaTheme } from '@dovenv/theme-banda'
 *
 * export default bandaTheme( {
 *   lint: { commitlint: { gitmoji: true } },
 *   docs: {
 *       input: 'README.md',
 *       output: 'build/README.md',
 *   },
 * } )
 */
export const bandaTheme = ( opts?: Config ) => {

	return defineConfig(
		lint.default( opts?.lint ),
		repo.default( opts?.repo ),
		workspace.default( opts?.workspace ),
		docs.default( opts?.docs ),
		convert.default( opts?.convert ),
		todo.default( opts?.todo ),
		templates.default( opts?.templates ),
		examples.default( opts?.examples ),
	)

}

export default bandaTheme
