import { getWorkspaceConfig } from '../packages/theme/pigeonposse/dist/main.mjs'

const CONSTS = await getWorkspaceConfig( {
	metaURL  : import.meta.url,
	path     : '../',
	corePath : './packages/core',
} )

export default CONSTS
