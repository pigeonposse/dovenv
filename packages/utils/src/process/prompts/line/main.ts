import * as p from '@clack/prompts'

import number      from './number'
import { symbol  } from './state'
import {
	box,
	columns,
	table,
}              from '../../../styles/main'
import { prompt as promptEnquirer } from '../prompt/main'

import type { State } from './state'
import type {
	BoxParams,
	ColumnsParams,
	PromptLineParams,
	TableParams,
} from './types'
import type { PromptParams } from '../prompt/types'

const enquirer2clack = async ( props: PromptParams, onCancel?: () => void ) => {

	p.log.message( )
	const res = await promptEnquirer( {
		...props,
		name   : 'id',
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

	// @ts-ignore: todo
	return res.id

}

const printOptions = {
	table   : ( ...innerParams: TableParams ) => p.log.message( table( ...innerParams ) ),
	columns : ( ...innerParams: ColumnsParams ) => p.log.message( columns( ...innerParams ) ),
	box     : ( ...innerParams: BoxParams ) => p.log.message( box( ...innerParams ) ),
}

/**
 * Define a group of prompts to be displayed and return a results of objects within the group.
 * @param   {PromptLineParams} params - PromptLine options .
 * @returns {Promise<*>}              - Object with answers.
 * @example
 * import { promptLine } from "@dovenv/utils"
 *
 * const answers = await promptLine({
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
export async function promptLine<T>( params: PromptLineParams<T> ) {

	if ( !params.onCancel ) params.onCancel = async p => {

		p.cancel( 'canceled 💔' )
		process.exit( 0 )

	}

	const promptCancel = {
		...p,
		number,
		...printOptions,
	}
	const typePrompt   = ( props: PromptParams ) => enquirer2clack( props, () => params.onCancel?.( promptCancel ) )
	const prompt       = {
		...promptCancel,
		typePrompt,
	}

	if ( params.intro ) prompt.intro( params.intro )
	const list    = await params.list( prompt )
	const results = await prompt.group<T>( list, { onCancel: () => params.onCancel?.( prompt ) } )

	if ( params.outro ) prompt.outro( params.outro )
	return results

}

