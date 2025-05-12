/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */

import * as p from '@clack/prompts'

import number             from './number'
import { symbol  }        from './state'
import {
	promptLineMethods,
	type PromptLineParams,
} from './types'
import { process }                       from '../../core'
import { promptGroup as promptEnquirer } from '../prompt/main'

import type { State }                 from './state'
import type { PromptLineCancelProps } from './types'
import type { PromptParams }          from '../prompt/types'

import {
	box,
	columns,
	table,
} from '@/styles'

const enquirer2clack = async ( props: PromptParams, onCancel?: () => void ) => {

	p.log.message( )
	const ID  = 'id'
	const res = await promptEnquirer( {
		...props,
		name   : ID,
		// @see https://github.com/enquirer/enquirer/blob/70bdb0fedc3ed355d9d8fe4f00ac9b3874f94f61/lib/state.js#L5
		// type State = "initial" | "active" | "cancel" | "submit" | "error"
		// @ts-ignore: todo
		prefix : state => {

			let s: State = 'active'
			if ( state.cancelled ) s = 'cancel'
			if ( state.submitted ) s = 'submit'
			if ( state.error !== '' ) s = 'error'
			return symbol( s )

		},
		// @ts-ignore: todo
		onCancel : async ( ) => {

			p.log.message( )
			if ( onCancel ) await onCancel()

		},
	} )
	p.log.message( )

	return ID in res ? res[ID] : undefined

}

const printOptions: Pick<PromptLineCancelProps, 'table' | 'columns' | 'box'> = {
	/**
	 * Logs a table in the prompt line.
	 */
	table : ( {
		value, opts, type = promptLineMethods.message,
	} ) => p.log[type]( table( value, opts ) ),
	/**
	 * Logs data formatted into aligned columns in the prompt line.
	 */
	columns : ( {
		value, opts, type = promptLineMethods.message,
	} ) => p.log[type]( columns( value, opts ) ),
	/**
	 * Logs a styled box in the prompt line.
	 */
	box : ( {
		value, opts, type = promptLineMethods.message,
	} ) => p.log[type]( box( value, opts ) ),
}

export const promptLineCore: typeof p = p
export const promptLineEnquirer = enquirer2clack

export const promptLine = {
	...promptLineCore,
	log : {
		...promptLineCore.log,
		errorWithExit : ( m: string ) => {

			promptLineCore.log.error( m )
			console.log()
			process.exit( 1 )

		},
	},
	number,
	...printOptions,
}

/**
 *
 * Define a group of prompts to be displayed and return a results of objects within the group.
 *
 * @param   {PromptLineParams} params - PromptLine options .
 * @returns {Promise<*>}              - Object with answers.
 * @example
 * import { promptLineGroup } from "@dovenv/utils"
 *
 * const answers = await promptLineGroup({
 *     intro: 'Dovenv init',
 *     outro: 'Succesfully finished 🌈',
 *     onCancel: p => {
 *         p.cancel('canceled 💔')
 *         process.exit(0)
 *     },
 *     list: async p => ({
 *        name: () => p.text({
 *            message: 'What is your organization?',
 *            placeholder: 'PigeonPosse',
 *            defaultValue: 'PigeonPosse',
 *        }),
 *        age: () => p.number({
 *            message: 'What is your age?',
 *        }),
 *     })
 * })
 *
 * console.log(answers.name, answers.age)
 */
export async function promptLineGroup<T>( params: PromptLineParams<T> ) {

	if ( !params.onCancel ) params.onCancel = async p => {

		p.cancel( 'canceled 💔' )
		process.exit( 0 )

	}

	const typePrompt = ( props: PromptParams ) => enquirer2clack( props, () => params.onCancel?.( promptLine ) )

	const all = {
		...promptLine,
		typePrompt,
	}

	if ( params.intro ) all.intro( params.intro )
	// @ts-ignore
	const list    = await params.list( all )
	const results = await all.group<T>( list, { onCancel: () => params.onCancel?.( all ) } )

	if ( params.outro ) {

		all.log.step( '' )
		all.outro( params.outro )

	}
	return results

}

