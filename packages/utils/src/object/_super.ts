import { getFileText } from '../sys/content'

export type CommonObj
	= Record<string, unknown>
		| Record<string, unknown>[]
		| unknown[]

export const getFileContent = getFileText
