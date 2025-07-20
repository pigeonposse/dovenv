
import { deps }           from './_deps'
import { markedTerminal } from './terminal'

import type { MarkedExtension } from 'marked'

import { getStringType } from '@/string'
import { fetch2string }  from '@/sys/content'
import { readFile }      from '@/sys/super'

export * from './shields'
export * from './parser'

const _getInput = async ( input: string ) => {

	const type = getStringType( input )

	if ( type === 'path' ) return await readFile( input, 'utf-8' )
	if ( type === 'url' ) return await fetch2string( input )
	return input

}

/**
 * Retrieves the Markdown content from a given path or URL or string.
 *
 * - If the input is a path, reads the file content.
 * - If the input is a URL, fetches the content.
 * - If the input is a string, returns it directly.
 * ---.
 *
 * @param   {string}          path - The path or URL to retrieve the Markdown content from.
 * @returns {Promise<string>}      - A promise that resolves to the Markdown content as a string.
 */
export const getMD = async ( path: string ): Promise<string> => {

	return await _getInput( path )

}

/**
 * Retrieves the HTML content from a given path or URL or string.
 *
 * - If the input is a path, reads the file content.
 * - If the input is a URL, fetches the content.
 * - If the input is a string, returns it directly.
 * ---.
 *
 * @param   {string}          path - The path or URL to retrieve the HTML content from.
 * @returns {Promise<string>}      - A promise that resolves to the HTML content as a string.
 */
export const getHTML = async ( path: string ): Promise<string> => {

	return await _getInput( path )

}

/**
 * Converts Markdown input to HTML.
 *
 * - If the input is a path, reads the file and converts its content.
 * - If the input is a URL, fetches the content and converts it.
 * - if the input is a string, converts it directly.
 * ---.
 *
 * @param   {string} input - The Markdown input to convert.
 * @returns {string}       - The converted HTML string.
 */
export const md2html = async ( input: string ) => {

	input        = await _getInput( input )
	const Marked = await deps.get( 'marked' )
	const marked = new Marked( { gfm: false /** Important for use with html2terminal */ } )
	return await marked.parse( input )

}

type Md2TerminalOpts = {
	/**
	 * Optional Used to override default styling.
	 *
	 * @see https://github.com/mikaelbr/marked-terminal?tab=readme-ov-file#options
	 */
	renderer?  : Parameters<typeof markedTerminal>[0]
	/**
	 * Options passed into cli-highlight. See readme there to see what options to pass.
	 *
	 * @see https://github.com/felixfbecker/cli-highlight
	 */
	highlight? : Parameters<typeof markedTerminal>[1]
}
/**
 * Converts a Markdown input to a terminal formatted string.
 *
 * - If the input is a path, reads the file and converts its content.
 * - If the input is a URL, fetches the content and converts it.
 * - if the input is a string, converts it directly.
 * ---.
 *
 * @param   {string}          input - The Markdown string, path or URL to convert.
 * @param   {Md2TerminalOpts} opts  - Options.
 * @returns {Promise<string>}       - The converted string.
 */
export const md2terminal = async ( input: string, opts?: Md2TerminalOpts ): Promise<string> => {

	input        = await _getInput( input )
	const Marked = await deps.get( 'marked' )
	const marked = new Marked( )
	// Register markedTerminal extension with the options if provided
	marked.use( markedTerminal( opts?.renderer, opts?.highlight ) as MarkedExtension )

	return await marked.parse( input )

}

/**
 * Converts HTML to Markdown.
 *
 * - If the input is a path, reads the file and converts its content.
 * - If the input is a URL, fetches the content and converts it.
 * - if the input is a string, converts it directly.
 * ---.
 *
 * @param   {string}          input - The HTML input to convert.
 * @returns {Promise<string>}       - The converted Markdown as a string.
 */
export const html2md = async ( input: string ) => {

	input                 = await _getInput( input )
	const rehypeParse     = await deps.get( 'rehype-parse' )
	const rehypeRemark    = await deps.get( 'rehype-remark' )
	const remarkStringify = await deps.get( 'remark-stringify' )
	const unified         = await deps.get( 'unified' )
	const file            = await unified()
		.use( rehypeParse, { fragment: true } )
		.use( rehypeRemark )
		.use( remarkStringify )
		.process( input )

	return String( file )

}

/**
 * Converts HTML to a formatted string suitable for the terminal.
 *
 * - If the input is a path, reads the file and converts its content.
 * - If the input is a URL, fetches the content and converts it.
 * - if the input is a string, converts it directly.
 * ---.
 *
 * @param   {string}          input - The HTML input to convert.
 * @returns {Promise<string>}       - The formatted string.
 */
export const html2terminal = async ( input: string ): Promise<string> => {

	input    = await _getInput( input )
	const md = await html2md( input )
	return await md2terminal( md )

}

export const incrementMdHeaders = ( content: string ) => {

	const lines = content.split( '\n' )

	let inCodeBlock = false

	const updatedLines = lines.map( line => {

		// Detecta el inicio o el final de un bloque de código
		if ( line.startsWith( '```' ) ) {

			inCodeBlock = !inCodeBlock
			return line // No modificar líneas de inicio o cierre de bloques de código

		}

		// Si estamos dentro de un bloque de código, no hacemos nada
		if ( inCodeBlock ) {

			return line

		}

		// Incrementar niveles de encabezado si es un encabezado válido (# ... ###)
		if ( /^(#{1,6})\s/.test( line ) ) {

			const matches = line.match( /^(#{1,6})\s/ )
			if ( matches ) {

				const currentHashes = matches[1]
				if ( currentHashes.length < 6 ) {

					// Incrementa los niveles de encabezado, pero no más allá de 6
					const newHashes = '#'.repeat( currentHashes.length + 1 )
					return line.replace( currentHashes, newHashes )

				}

			}

		}

		// Devolver la línea sin modificar si no es un encabezado
		return line

	} )

	return updatedLines.join( '\n' )

}

/**
 * Parses the given Markdown string and returns an array of objects containing
 * the title, level and anchor for each header found.
 *
 * - If the input is a path, reads the file input.
 * - If the input is a URL, fetches the content.
 * - if the input is a string, gets it directly.
 * ---.
 *
 * @param   {string}            input - The Markdown input to parse.
 * @returns {Promise<object[]>}       - An array of objects with the following properties:
 *                                    - `level`: The header level (1-6).
 *                                    - `title`: The header title.
 *                                    - `anchor`: The header anchor.
 */
export const getMDToc = async ( input: string ) => {

	input        = await _getInput( input )
	const Marked = await deps.get( 'marked' )
	const marked = new Marked( )
	const tokens = marked.lexer( input )
	const index: {
		level  : number
		title  : string
		anchor : string
	}[]  = []

	// Iterate over all tokens and extract the headers
	for ( const token of tokens ) {

		if ( token.type === 'heading' ) {

			const level  = token.depth
			const title  = token.text
			const anchor = title.toLowerCase().replace( /\s+/g, '-' ).replace( /[^\w-]+/g, '' ) // Create anchor

			index.push( {
				level,
				title,
				anchor,
			} )

		}

	}

	return index

}

type MdTocStringOpts = {
	/**
	 * The Markdown content to be used for generating the Table of Contents.
	 * This can be a string of Markdown content, a file, or a URL.
	 *
	 * @example
	 * const markdown = '# Header 1\n## Header 2\n';
	 */
	input            : string
	/**
	 * The title for the Table of Contents. If not provided, the default value is 'Table of Contents'.
	 *
	 * @default undefined
	 */
	title?           : string
	/**
	 * If set to `true`, headers of level 1 (`#`) will be removed from the Table of Contents.
	 *
	 * @default false
	 */
	removeH1?        : boolean
	/**
	 * The maximum heading level to include in the Table of Contents.
	 * If not provided, the TOC will include all heading levels.
	 *
	 * @default 6
	 */
	maxHeadingLevel? : number
}

/**
 * Creates a Markdown index from the given Markdown string.
 *
 * - If the input is a path, reads the file input.
 * - If the input is a URL, fetches the content.
 * - if the input is a string, gets it directly.
 * ---.
 *
 * @param   {string}          opts                   - Options.
 * @param   {string}          opts.input             - The Markdown input to create an index from.
 * @param   {string}          [opts.title]           - The title of the index.
 * @param   {boolean}         [opts.removeH1]        - If set to `true`, headers of level 1 (`#`) will be removed.
 * @param   {number}          [opts.maxHeadingLevel] - The maximum heading level to include in the Table of Contents.
 * @returns {Promise<string>}                        - The generated Markdown index as a string.
 */
export const geMDTocString = async ( opts : MdTocStringOpts ): Promise<string> => {

	let baseLevel: number, indexMarkdown: string

	const {
		title, input, removeH1, maxHeadingLevel,
	} = opts

	indexMarkdown = title ? `## ${title}\n\n` : ''
	const index   = await getMDToc( input )

	// Filter out level 1 headers if removeH1 is true
	const filteredIndex = removeH1
		? index.filter( item => item.level !== 1 )
		: index

	// Filter by maximum heading level if specified
	const maxLevel           = maxHeadingLevel ?? 6 // Default to level 6 if not provided
	const filteredByMaxLevel = filteredIndex.filter( item => item.level <= maxLevel )

	// Determine the base level of the first header
	baseLevel = 1
	if ( filteredByMaxLevel.length && filteredByMaxLevel[0].level > 1 ) {

		baseLevel = filteredByMaxLevel[0].level // If first header is H2 or higher, treat it as level 1

	}

	// Generate the TOC in Markdown format

	filteredByMaxLevel.forEach( ( item, index ) => {

		// Adjust indent based on the base level
		const indent   = index > 0 && item.level > baseLevel ? '  '.repeat( item.level - baseLevel ) : ''
		indexMarkdown += `${indent}- [${item.title}](#${item.anchor})\n`

	} )

	return indexMarkdown

}
