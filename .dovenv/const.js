import { getWorkspaceConfig } from '../packages/theme/pigeonposse/dist/main.mjs'

const CONSTS = await getWorkspaceConfig( {
	metaURL : import.meta.url,
	path    : '../',
	core    : {
		metaURL : import.meta.url,
		path    : '../packages/core',
	},
} )

export default CONSTS
