import { sys } from 'creatium'

import {
	extra,
	homepage,
	description,
} from '../../../package.json'
import coreMeta             from '../../core/package.json'
import pluginAIMeta         from '../../plugin/ai/package.json'
import pluginConvertMeta    from '../../plugin/convert/package.json'
import pluginDocsMeta       from '../../plugin/docs/package.json'
import pluginExamplesMeta   from '../../plugin/examples/package.json'
import pluginLintMeta       from '../../plugin/lint/package.json'
import pluginMediaMeta      from '../../plugin/media/package.json'
import pluginRepoMeta       from '../../plugin/repo/package.json'
import pluginTodosMeta      from '../../plugin/todo/package.json'
import pluginWorkspaceMeta  from '../../plugin/workspace/package.json'
import themeBandaMeta       from '../../theme/banda/package.json'
import themePigeonPosseMeta from '../../theme/pigeonposse/package.json'
import utilsMeta            from '../../utils/package.json'
import { version }          from '../package.json'
import { mapObject }        from './_utils'
import { dataDir }          from '../data/index.js'

const { joinPath: join } = sys

const name = extra.id

const templatesDir = join( dataDir, 'templates' )
const partialsDir  = join( dataDir, 'partials' )
const SELECT_NONE  = 'none' as const

export {
	version,
	homepage,
	description,
	name,
}

export const CORE_META = coreMeta
export const UTILS_META = utilsMeta

export const THEME_META = {
	pigeonposse : themePigeonPosseMeta,
	banda       : themeBandaMeta,
} as const

export const PLUGIN_META = {
	ai        : pluginAIMeta,
	convert   : pluginConvertMeta,
	docs      : pluginDocsMeta,
	examples  : pluginExamplesMeta,
	lint      : pluginLintMeta,
	media     : pluginMediaMeta,
	repo      : pluginRepoMeta,
	todo      : pluginTodosMeta,
	workspace : pluginWorkspaceMeta,
} as const

export const LANGUAGE = {
	js : 'js',
	ts : 'ts',
} as const

export const CORE_BIN_NAME = Object.keys( CORE_META.bin )[0] || CORE_META.name

export const PROJECT_PATH = {
	dataDir,
	templatesDir,
	partialsDir,
} as const

export const PARTIAL_DIR = {
	workspace    : join( partialsDir, 'workspace' ),
	monorepo     : join( partialsDir, 'monorepo' ),
	monorepoPnpm : join( partialsDir, 'monorepo-pnpm' ),
	srcJS        : join( partialsDir, 'src-js' ),
	srcTS        : join( partialsDir, 'src-ts' ),
	lint         : join( partialsDir, 'lint' ),
} as const

const mapID = <T extends Record<string, unknown>>( obj: T ) => ( {
	...mapObject( obj, ( _v, k ) => k ) as ( { [key in keyof T]: key } ),
	none : SELECT_NONE,
} )

export const PLUGIN_ID = mapID( PLUGIN_META )
export const THEME_ID = mapID( THEME_META )
export const PARTIAL_ID = mapID( PARTIAL_DIR )
