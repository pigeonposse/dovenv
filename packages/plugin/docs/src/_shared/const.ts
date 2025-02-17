import { CommandUtils } from '@dovenv/core'

import {
	name,
	version,
	dependencies,
	description,
	homepage,
} from '../../package.json'

import type {
	DocsData,
	RequiredDocsConfig,
} from '../config/types'

export const vitepressVersion = dependencies.vitepress
export const globals = {
	DOVENV_CONFIG_PATH      : 'DOVENV_CONFIG_PATH',
	DOVENV_UTILS            : 'DOVENV_UTILS',
	DOVENV_DOCS_CONFIG_PATH : 'DOVENV_DOCS_CONFIG_PATH',
	DOVENV_DOCS_CONFIG      : 'DOVENV_DOCS_CONFIG',
	DOVENV_DOCS_DATA        : 'DOVENV_DOCS_DATA',
	VITEPRESS_CONFIG        : 'VITEPRESS_CONFIG',
} as const

export type Global = typeof globals[keyof typeof globals]
export type Globals = {
	[globals.DOVENV_UTILS]            : CommandUtils
	[globals.DOVENV_CONFIG_PATH]      : string | undefined
	[globals.DOVENV_DOCS_CONFIG_PATH] : string | undefined
	[globals.DOVENV_DOCS_CONFIG]      : RequiredDocsConfig | undefined
	[globals.DOVENV_DOCS_DATA]        : DocsData | undefined
	[globals.VITEPRESS_CONFIG]   : {
		pages            : string[] | undefined
		[ key : string ] : unknown
	} | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setGlobals = ( type: Global, value: any ) => {

	// @ts-ignore: necearry for build 'dovenv' docs page
	globalThis[globals[type]] = value

}

export const getGlobals = <ID extends Global>( type: ID ): Globals[ID] | undefined => {

	// @ts-ignore: necearry for build 'dovenv' docs page
	return globals[type] in globalThis ? globalThis[globals[type] as keyof Globals] : undefined

}

export {
	name,
	version,
	description,
	homepage,
}
