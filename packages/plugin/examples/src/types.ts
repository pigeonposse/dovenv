/* eslint-disable @stylistic/object-curly-newline */

import type { TYPE }                   from './const'
import type { schema }                 from './schema'
import type { Config as DovenvConfig } from '@dovenv/core'
import type { getPaths,
	Prettify,
	ValidateInfer } from '@dovenv/core/utils'

type ExampleProps =  { [key in string]:  {
	/**
	 * Title of the example (optional).
	 */
	title? : string
	/**
	 * General description of the example (optional).
	 */
	desc?  : string
	/**
	 * Outro or conclusion of the example (optional).
	 */
	outro? : string
	/**
	 * Additional data of the example.
	 * Each element must comply with the structure defined in `infoSchema`.
	 */
	data: {
		[key in string]: {
			/**
			 * Main input for the data.
			 */
			input  : string
			/**
			 * Title of the data (optional).
			 */
			title? : string
			/**
			 * Type of the data (optional).
			 */
			type?  : string
			/**
			 * Description of the data (optional).
			 */
			desc?  : string
			/**
			 * Outro or conclusion of the data (optional).
			 */
			outro? : string
		}
	}
} }

type ExampleConfig = ExampleProps extends ValidateInfer<typeof schema> ? ExampleProps : never

type Shared = {
	/** Write a output if you want */
	output? : string
	/**
	 * h1 for markdown
	 * @default 'Examples'
	 */
	title?  : string | false
	/**
	 * Description
	 * @default 'Examples'
	 */
	desc?   : string
}

export type ExampleConfigFileProps =  Prettify<Shared & {
	/** Override your config input */
	config? : ExampleConfig
	/**
	 * Input of your config (path or config object)
	 *
	 * Path formats: JSON, YAML, TOML JS etc
	 */
	input   : string | ExampleConfig
}>
type ExampleType = typeof TYPE[keyof typeof TYPE]
export type ExamplePathProps = Prettify< Shared & {
	/** Input pattern */
	input : string[]
	/** Options for input patterns */
	opts? : Parameters<typeof getPaths>[1]
}>

export type ExampleJsdocProps =  ExamplePathProps

export type ExampleMultipleProps = Prettify<Shared & {
	[TYPE.JSDOC]?  : Omit<ExampleJsdocProps, 'output'>
	[TYPE.CONFIG]? : Omit<ExampleConfigFileProps, 'output'>
	[TYPE.PATH]?   : Omit<ExamplePathProps, 'output'>
}>
export type ExampleCustomProps = {
	fn: ( data: {
		/** Dovenv configration */
		config : DovenvConfig
		/** "Example" functions to run */
		run: {
			[TYPE.JSDOC]    : ( data: ExampleJsdocProps ) => Promise<string>
			[TYPE.CONFIG]   : ( data: ExampleConfigFileProps ) => Promise<string>
			[TYPE.PATH]     : ( data: ExamplePathProps ) => Promise<string>
			[TYPE.MULTIPLE] : ( data: ExampleMultipleProps ) => Promise<string>
		}
	} ) => Promise<unknown>
}
type Set<T extends ExampleType, V extends object> = ( {
	/** type of configuration */
	type : T
} & V )

type ConfigValue = Prettify<
	Set< typeof TYPE.PATH, ExamplePathProps >
	| Set< typeof TYPE.CONFIG, ExampleConfigFileProps >
	| Set< typeof TYPE.JSDOC, ExampleJsdocProps >
	| Set< typeof TYPE.MULTIPLE, ExampleMultipleProps >
	| Set< typeof TYPE.CUSTOM, ExampleCustomProps >
>
export type Config = { [key in string]: ConfigValue }
