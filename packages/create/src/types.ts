import type {
	LANGUAGE,
	PLUGIN_ID,
	THEME_ID,
} from './const'

export type CustomParams = {
	lang?   : typeof LANGUAGE[keyof typeof LANGUAGE]
	theme?  : typeof THEME_ID[keyof typeof THEME_ID]
	plugin? : ( typeof PLUGIN_ID[keyof typeof PLUGIN_ID] )[]
}
