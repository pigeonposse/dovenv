import updateNotifierLib from 'update-notifier'

export const updateNotifier = ( name: string, version: string ) => updateNotifierLib( { pkg : {
	name,
	version,
} } )
