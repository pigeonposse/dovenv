import { config as docsConfig }  from '@dovenv/docs'
import { config as lintConfig }  from '@dovenv/lint'
import { config as mediaConfig } from '@dovenv/media'
import { defineConfig }          from 'dovenv'

type Config = {
	media? : Parameters<typeof mediaConfig>[0]
	lint?  : Parameters<typeof lintConfig>[0]
	docs?  : Parameters<typeof docsConfig>[0]
}
export const config = ( opts?: Config ) => defineConfig( [
	mediaConfig( opts?.media ),
	lintConfig( opts?.lint ),
	docsConfig( opts?.docs ),
] )
