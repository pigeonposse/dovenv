import { config as convertConfig }  from '@dovenv/convert'
import { config as docsConfig }     from '@dovenv/docs'
import { config as examplesConfig } from '@dovenv/examples'
import { config as lintConfig }     from '@dovenv/lint'
import { config as mediaConfig }    from '@dovenv/media'
import { config as repoConfig }     from '@dovenv/repo'
import { config as todoConfig }     from '@dovenv/todo'
import { defineConfig }             from 'dovenv'

type Config = {
	media?    : Parameters<typeof mediaConfig>[0]
	lint?     : Parameters<typeof lintConfig>[0]
	docs?     : Parameters<typeof docsConfig>[0]
	convert?  : Parameters<typeof convertConfig>[0]
	repo?     : Parameters<typeof repoConfig>[0]
	todo?     : Parameters<typeof todoConfig>[0]
	examples? : Parameters<typeof examplesConfig>[0]
}
export const config = ( opts?: Config ) => defineConfig( [
	mediaConfig( opts?.media ),
	lintConfig( opts?.lint ),
	docsConfig( opts?.docs ),
	convertConfig( opts?.convert ),
	repoConfig( opts?.repo ),
	todoConfig( opts?.todo ),
	examplesConfig( opts?.examples ),
] )
