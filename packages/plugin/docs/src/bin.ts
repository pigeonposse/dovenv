#!/usr/bin/env node

import { createCLI } from '@dovenv/core'

import {
	binName as name,
	version,
} from './_shared/const'
import { docsPlugin } from './plugin'

const { custom } = docsPlugin()
const COMMAD     = custom?.docs

await createCLI( {
	name,
	version,
	opts : COMMAD?.opts,
	// examples : COMMAD?.examples,
	cmds : COMMAD?.cmds
		? Object.fromEntries( Object.entries( COMMAD.cmds ).map( ( [ key, value ] ) => [
			key,
			{
				...value,
				settings : COMMAD.settings,
				fn       : COMMAD.fn,
			},
		] ) )
		: undefined,
} )
