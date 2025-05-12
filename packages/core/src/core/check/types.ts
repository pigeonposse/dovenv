/* eslint-disable @stylistic/object-curly-newline */
import { TYPE }     from './const'
import { Prettify } from '../../../../utils/dist/main'
import {
	Response,
} from '../../_shared/types'
import { Command } from '../_shared/main'

type CheckType = typeof TYPE[keyof typeof TYPE]

type CheckShared = {
	/** Description of your check */
	desc? : string
}
type Utils = Command['utils']
export type CheckDir = CheckShared & {
	/** Glob patterns of dirs for check */
	patterns     : string[]
	/** Validation function for all dirs */
	validateAll? : ( data: {
		/** Paths of the dirs */
		paths : string[]
		/** Dovenv config */
		utils : Utils
	} ) => Response<void>
	/** Validation function called every time a dir path is read */
	validate?    : ( data: {
		/** Path of the dir */
		path  : string
		/** Dovenv config */
		utils : Utils
	} ) => Response<void>
}

export type CheckFile = CheckShared & {
	/** Glob patterns of files for check */
	patterns     : string[]
	/** Validation function for all dirs */
	validateAll? : ( data: {
		/** Paths of the files */
		paths : string[]
		/** Dovenv config */
		utils : Utils
	} ) => Response<void>
	/**
	 * Validation function. It is called every time a file path is read.
	 *
	 * @example
	 * const validate = async ( {path, content} ) => {
	 *   if ( !content ) throw new Error(`File [${path}] must exist`)
	 *   else if( content === '' ) throw new Error(`File [${path}] is empty and must have content`)
	 * }
	 */
	validate? : ( data: {
		/** Path of the file */
		path     : string
		/** Content of the file */
		content? : string
		/** Dovenv config */
		utils    : Utils
	} ) => Response<void>
}

export type CheckCustom = CheckShared & { fn: ( data: {
	utils : Utils
	run: {
		file : ( d:CheckFile ) => Promise<void>
		dir  : ( d:CheckDir ) => Promise<void>
	}
} ) => Response<void> }

type CheckConfigValue<T extends CheckType, V extends object> = {
	/** Type of check */
	type : T
} & V

export type CheckConfig = Prettify<Record<string,
	CheckConfigValue<typeof TYPE.FILE, CheckFile>
	| CheckConfigValue<typeof TYPE.DIR, CheckDir>
	| CheckConfigValue<typeof TYPE.CUSTOM, CheckCustom>
>>
