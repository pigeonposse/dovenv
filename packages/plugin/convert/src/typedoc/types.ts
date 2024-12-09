/* eslint-disable @stylistic/object-curly-newline */
import type { ConvertPropsSuper } from '../_shared/types'
import type { Prettify }          from '@dovenv/core/utils'
import type { TypeDocOptions }    from 'typedoc'
import type { PluginOptions }     from 'typedoc-plugin-markdown'

type TypedocOpts = Partial<Omit<TypeDocOptions, 'entryPoints' | 'tsconfig' | 'plugin' | 'out'>>
type PluginOpts = Partial<PluginOptions>
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type EmptyObject = {}

export type TypescriptSharedProps<Opts extends Record<string, unknown> = EmptyObject> = Prettify< ConvertPropsSuper & {
	/**
	 * Options
	 * @see https://dovenv.pigeonposse.com/guide/plugin/convert
	 */
	opts? : Prettify<{
		/**
		 * __Cuaton tsconfig path__.
		 *
		 * Used for getting the ts config of the output.
		 * @default
		 * join( process.cwd(), "tsconfig.ts" )
		 */
		tsconfigPath?    : string
		/**
		 * __Package.json path__.
		 *
		 * This path is used to extract specific properties from the `package.json` file.
		 * @default
		 * join( process.cwd(), "package.json" )
		 */
		packageJsonPath? : string
		/**
		 * Name of your project.
		 */
		name?            : string
		/**
		 * Hooks.
		 */
		hooks?: {
			before? : ( ) => Promise<string> | string
			after?  : ( ) => Promise<string> | string
		}
		/**
		 * Transform function.
		 */
		transform? : ( content: string ) => Promise<string>
		/**
		 * Typedoc options
		 * @see https://typedoc.org/options/
		 */
		typedoc?   : TypedocOpts
	} & Opts>
}>

export type Typescript2HtmlProps = TypescriptSharedProps

export type Typescript2MarkdownProps = TypescriptSharedProps< {
	/**
	 * Typedoc markdown options
	 * @see @see https://typedoc-plugin-markdown.org/docs/options
	 */
	typedocMarkdown? : PluginOpts
}>
