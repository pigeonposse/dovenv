/* eslint-disable @stylistic/object-curly-newline */

import { TreeConfig,
	TreeContent } from '@ascii-kit/tree'

import type { getPaths } from '@/sys/super'
import type { Prettify } from '@/ts'

export type SetDirTree = {
	structure : TreeContent
	opts?     : TreeConfig
}
type SharedStructure = {
	/**
	 * The maximum number of directories to traverse.
	 */
	max?  : number
	/**
	 * The order to traverse the directories.
	 *
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

