import { config as convertConfig }   from '@dovenv/convert'
import { defineConfig }              from '@dovenv/core'
import { config as docsConfig }      from '@dovenv/docs'
import { config as examplesConfig }  from '@dovenv/examples'
import { config as lintConfig }      from '@dovenv/lint'
import { config as mediaConfig }     from '@dovenv/media'
import { config as repoConfig }      from '@dovenv/repo'
import { config as todoConfig }      from '@dovenv/todo'
import { createMergeDataFn }         from '@dovenv/utils'
import { config as workspaceConfig } from '@dovenv/workspace'

export type Config = {
	media?     : Parameters<typeof mediaConfig>[0]
	lint?      : Parameters<typeof lintConfig>[0]
	docs?      : Parameters<typeof docsConfig>[0]
	convert?   : Parameters<typeof convertConfig>[0]
	repo?      : Parameters<typeof repoConfig>[0]
	todo?      : Parameters<typeof todoConfig>[0]
	examples?  : Parameters<typeof examplesConfig>[0]
	workspace? : Parameters<typeof workspaceConfig>[0]
}

/**
 * Merges multiple configuration objects into a single configuration.
 */
export const mergeConfig = createMergeDataFn<Config>(  )

export const config = ( opts?: Config ) => {

	return defineConfig( [
		mediaConfig( opts?.media ),
		lintConfig( opts?.lint ),
		docsConfig( opts?.docs ),
		convertConfig( opts?.convert ),
		repoConfig( opts?.repo ),
		todoConfig( opts?.todo ),
		examplesConfig( opts?.examples ),
		workspaceConfig( opts?.workspace ),
	] )

}
