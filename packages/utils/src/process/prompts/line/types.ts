import type number from './number'
import type {
	box,
	columns,
	table,
}              from '../../../styles/main'
import type { PromptParams } from '../prompt/types'
import type * as p           from '@clack/prompts'

export const promptLineMethods = {
	message : 'message',
	info    : 'info',
	success : 'success',
	step    : 'step',
	warn    : 'warn',
	warning : 'warning',
	error   : 'error',
} as const
export type PromptLineMethod = typeof promptLineMethods[keyof typeof promptLineMethods]

/**
 * NUMBER.
 *
 */

export type NumberParams = p.TextOptions & {
	placeholder?  : number
	defaultValue? : number
	errorText?    : string
}

/**
 * Parameters of the `table` function from the `@dovenv/utils` module.
 *
 * [See module](https://clippo.pigeonposse.com/guide/utils/style#table).
 */
export type TableParams = Parameters<typeof table>
/**
 * Parameters of the `columns` function from the `@dovenv/utils` module.
 *
 * [See module](https://clippo.pigeonposse.com/guide/utils/styles#columns).
 */
export type ColumnsParams = Parameters<typeof columns>

/**
 * Parameters of the `box` function from the `@dovenv/utils` module.
 *
 * [See module](https://clippo.pigeonposse.com/guide/utils/styles#box).
 */
export type BoxParams = Parameters<typeof box>

/**
 * Props for canceling a prompt line, including functions from various modules.
 */
export type PromptLineCancelProps = typeof p & {
	number : typeof number
	table   : ( opts:{
		value : TableParams
		type? : PromptLineMethod
	} ) => void
	box     : ( opts:{
		value : BoxParams
		type? : PromptLineMethod
	} ) => void
	columns : ( opts:{
		value : ColumnsParams
		type? : PromptLineMethod
	}  ) => void
}

/**
 * Props for executing a prompt line, extending `PromptLineCancelProps` with typePrompt.
 */
type PromptLineExecProps = PromptLineCancelProps & { typePrompt: <T>( props: PromptParams ) => Promise<T> }

/**
 * Parameters for configuring a prompt line.
 */
export type PromptLineParams<T> = {
	intro?    : string
	outro?    : string
	list      : ( prompt: PromptLineExecProps ) => p.PromptGroup<T> | Promise<p.PromptGroup<T>>
	onCancel? : ( prompt: PromptLineCancelProps ) => Promise<void>
}
