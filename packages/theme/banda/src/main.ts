
import * as convert          from '@dovenv/convert'
import { defineConfig }      from '@dovenv/core'
import { createMergeDataFn } from '@dovenv/core/utils'
import * as docs             from '@dovenv/docs'
import * as examples         from '@dovenv/examples'
import * as lint             from '@dovenv/lint'
import * as media            from '@dovenv/media'
import * as repo             from '@dovenv/repo'
import * as todo             from '@dovenv/todo'
import * as workspace        from '@dovenv/workspace'

export {
	convert,
	docs,
	examples,
	lint,
	media,
	repo,
	todo,
	workspace,
}

export type Config = {
	media?     : Parameters<typeof media.config>[0]
	lint?      : Parameters<typeof lint.config>[0]
	docs?      : Parameters<typeof docs.config>[0]
	convert?   : Parameters<typeof convert.config>[0]
	repo?      : Parameters<typeof repo.config>[0]
	todo?      : Parameters<typeof todo.config>[0]
	examples?  : Parameters<typeof examples.config>[0]
	workspace? : Parameters<typeof workspace.config>[0]
}

/**
 * Merges multiple configuration objects into a single configuration.
 */
export const mergeConfig = createMergeDataFn<Config>(  )

export const config = ( opts?: Config ) => {

	return defineConfig( [
		media.config( opts?.media ),
		lint.config( opts?.lint ),
		docs.config( opts?.docs ),
		convert.config( opts?.convert ),
		repo.config( opts?.repo ),
		todo.config( opts?.todo ),
		examples.config( opts?.examples ),
		workspace.config( opts?.workspace ),
	] )

}
