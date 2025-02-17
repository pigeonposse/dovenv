/* eslint-disable @stylistic/object-curly-newline */

import type { getPaths } from '../sys/super/main'
import type { Prettify } from '../ts/main'

export type SetDirTreeStyleParams = {
	/** Name of the file or folder */
	name     : string
	/** Indentation level */
	indent   : number
	/** Whether it is the last item in the current level */
	isLast   : boolean
	/** Whether it is the first item in the current level */
	isFirst  : boolean
	/** Whether it is a folder */
	isFolder : boolean
}
export type SetDirTree = {
	structure : object
	name?     : string
	style?    : ( opts: SetDirTreeStyleParams ) => string
}
type SharedStructure = {
	/**
	 * The maximum number of directories to traverse.
	 */
	max?  : number
	/**
	 * The order to traverse the directories.
	 * @default 'atoz'
	 */
	sort? : 'atoz' | 'ztoa'
}
export type DirStructureParams = SharedStructure & {
	/**
	 * The root path of the directory to read.
	 */
	input : string
}

export type PathsStructureParams = SharedStructure & {
	/**
	 * The input paths to process.
	 */
	input        : string[]
	/**
	 * Additional options for the pattern.
	 */
	patternOpts? : Parameters<typeof getPaths>[1]
}

export type PathTreeOpts = Prettify<Omit<SetDirTree, 'structure'> & DirStructureParams>
export type PatternTreeOpts = Prettify<Omit<SetDirTree, 'structure'> & PathsStructureParams>

