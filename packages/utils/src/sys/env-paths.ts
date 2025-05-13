import os from 'node:os'

import {
	joinPath,
	getBaseName,
} from './super'

import { process } from '@/process'

const homedir = os.homedir()
const tmpdir  = os.tmpdir()
const { env } = process

const macos = ( name: string ) => {

	const library = joinPath( homedir, 'Library' )

	return {
		data   : joinPath( library, 'Application Support', name ),
		config : joinPath( library, 'Preferences', name ),
		cache  : joinPath( library, 'Caches', name ),
		log    : joinPath( library, 'Logs', name ),
		temp   : joinPath( tmpdir, name ),
	}

}

const windows = ( name: string ) => {

	const appData      = env.APPDATA || joinPath( homedir, 'AppData', 'Roaming' )
	const localAppData = env.LOCALAPPDATA || joinPath( homedir, 'AppData', 'Local' )

	return {
		// Data/config/cache/log are invented by me as Windows isn't opinionated about this
		data   : joinPath( localAppData, name, 'Data' ),
		config : joinPath( appData, name, 'Config' ),
		cache  : joinPath( localAppData, name, 'Cache' ),
		log    : joinPath( localAppData, name, 'Log' ),
		temp   : joinPath( tmpdir, name ),
	}

}

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const linux = ( name: string ) => {

	const username = getBaseName( homedir )

	return {
		data   : joinPath( env.XDG_DATA_HOME || joinPath( homedir, '.local', 'share' ), name ),
		config : joinPath( env.XDG_CONFIG_HOME || joinPath( homedir, '.config' ), name ),
		cache  : joinPath( env.XDG_CACHE_HOME || joinPath( homedir, '.cache' ), name ),
		// https://wiki.debian.org/XDGBaseDirectorySpecification#state
		log    : joinPath( env.XDG_STATE_HOME || joinPath( homedir, '.local', 'state' ), name ),
		temp   : joinPath( tmpdir, username, name ),
	}

}

export const getSystemEnvPaths = ( {
	name, suffix = 'nodejs',
}:{
	name    : string
	suffix? : string
} ) => {

	if ( typeof name !== 'string' )
		throw new TypeError( `Expected a string, got ${typeof name}` )

	if ( suffix ) name += `-${suffix}`

	if ( process.platform === 'darwin' ) return macos( name )
	if ( process.platform === 'win32' ) return windows( name )

	return linux( name )

}
