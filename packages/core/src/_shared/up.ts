import { Updater } from '@clippium/updater'

export const updateNotifier = ( name: string, version: string ) => {

	const up = new Updater( {
		name,
		version,
	} )
	return { notify: () => up.notify( ) }

}
