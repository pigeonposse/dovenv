import {
	name,
	version,
	dependencies,
	description,
} from '../../package.json'

export const vitepressVersion = dependencies.vitepress
export const globals = {
	DOVENV_DOCS_CONFIG_PATH : 'DOVENV_DOCS_CONFIG_PATH',
	DOVENV_DOCS_CONFIG      : 'DOVENV_DOCS_CONFIG',
}
export type Globals = {
	DOVENV_DOCS_CONFIG_PATH : string
	DOVENV_DOCS_CONFIG      : Record<string, unknown> | unknown[] | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setGlobals = ( type: typeof globals[keyof typeof globals], value: any ) => {

	globalThis[globals[type]] = value

}

export {
	name,
	version,
	description,
}
