import {
	name,
	version,
	dependencies,
	description,
} from '../../package.json'

export const vitepressVersion = dependencies.vitepress
export const globals = { DOVENV_DOCS_CONFIG: 'DOVENV_DOCS_CONFIG' } as const
type Global = typeof globals[keyof typeof globals]
export type Globals = { DOVENV_DOCS_CONFIG: Record<string, unknown> | unknown[] | undefined }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setGlobals = ( type: Global, value: any ) => {

	globalThis[globals[type]] = value

}

export const getGlobals = ( type: Global ) => {

	return globalThis[globals[type]]

}

export {
	name,
	version,
	description,
}
