import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import markdownItContainer     from 'markdown-it-container'
// @ts-ignore
import MarkdownItTaskList    from 'markdown-it-task-lists'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'

import { ConfigResponse } from '../config/types'

import type { UserConfig } from 'vitepress'

type MD = NonNullable<UserConfig['markdown']>
type MDConfig = NonNullable<MD['config']>
type MDIt = Parameters<MDConfig>[0]

const markdownItSteps = ( md: MDIt ) => {

	md.use( markdownItContainer, 'steps', {
		// @ts-ignore
		validate : params => params.trim().match( /^steps\s*$/ ),
		// @ts-ignore
		render   : ( tokens, idx ) => {

			const token = tokens[idx]

			if ( token.nesting === 1 ) return '<div class="steps">\n'
			else return '</div>\n'

		},

	} )

	md.use( markdownItContainer, 'step', {
		// @ts-ignore
		validate : params => params.trim().match( /^step\s+([\w\s\S]+)/ ),
		// @ts-ignore
		render   : ( tokens, idx ) => {

			const token = tokens[idx]

			if ( token.nesting === 1 ) {

				// Captura la palabra o emoji y toma el primer carácter
				const match = token.info.trim().match( /^step\s+([\w\s\S]+)/ )
				const name  = match ? match[1].substring( 0, 1 ) : ''

				return `<div class="step">\n<span class="step-number">${name}</span>\n`

			}
			else {

				return '</div>\n'

			}

		},
	} )

}

const line = '------------------------'

export const markdown = ( {
	data, config,
}: ConfigResponse ): UserConfig['markdown'] => ( {
	config : md => {

		md.use( MarkdownItTaskList )
		md.use( markdownItSteps )
		if ( config.groupIcon !== false ) md.use( groupIconMdPlugin )

	},
	codeTransformers : config.twoslash !== false
		? [
			transformerTwoslash( {
				throws          : !data.devMode,
				onShikiError    : error => console[data.devMode ? 'warn' : 'error']( error ),
				onTwoslashError : ( e, code, lang ) => console[data.devMode ? 'warn' : 'error'](
					`Twoslash (${lang}) Error:\n\n${line}\n${e instanceof Error ? e.message : ''}\n\n${line}\n\n${code}\n\n${line}`,
				),
				...config.twoslash,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} ) as any,
		]
		: undefined,
} )
