import { marked }         from 'marked'
import { markedTerminal } from 'marked-terminal'
import TurndownService    from 'turndown'

import { getStringType } from '../string/main'
import { fetch2string }  from '../sys/content'
import { readFile }      from '../sys/super/main'

import type { MarkedExtension } from 'marked'

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
 * ---
 * @param {string} path - The path or URL to retrieve the Markdown content from.
 * @returns {Promise<string>} - A promise that resolves to the Markdown content as a string.
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
 * ---
 * @param {string} path - The path or URL to retrieve the HTML content from.
 * @returns {Promise<string>} - A promise that resolves to the HTML content as a string.
 */
export const geHTML = async ( path: string ): Promise<string> => {

	return await _getInput( path )

}

/**
 * Converts Markdown input to HTML.
 *
 * - If the input is a path, reads the file and converts its content.
 * - If the input is a URL, fetches the content and converts it.
 * - if the input is a string, converts it directly.
 * ---
 * @param {string} input - The Markdown input to convert.
 * @returns {string} - The converted HTML string.
 */
export const md2html = async ( input: string ) => {

	input = await _getInput( input )
	return await marked( input )

}

type Md2TerminalOpts = {
	/**
	 * Optional Used to override default styling.
	 * @see https://github.com/mikaelbr/marked-terminal?tab=readme-ov-file#options
	 */
	renderer?  : Parameters<typeof markedTerminal>[0]
	/**
	 * Options passed into cli-highlight. See readme there to see what options to pass.
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
 * ---
 * @param {string} input - The Markdown string, path or URL to convert.
 * @param opts
 * @returns {Promise<string>} - The converted string.
 */
export const md2terminal = async ( input: string, opts?: Md2TerminalOpts ): Promise<string> => {

	input = await _getInput( input )

	marked.use( markedTerminal( opts?.renderer, opts?.highlight ) as MarkedExtension )
	return await marked.parse( input  )

}

/**
 * Converts HTML to Markdown.
 *
 * - If the input is a path, reads the file and converts its content.
 * - If the input is a URL, fetches the content and converts it.
 * - if the input is a string, converts it directly.
 * ---
 * @param {string} input - The HTML input to convert.
 * @returns {Promise<string>} - The converted Markdown as a string.
 */
export const html2md = async ( input: string ) => {

	input = await _getInput( input )

	const turndownService = new TurndownService()
	return turndownService.turndown( input )

}

/**
 * Converts HTML to a formatted string suitable for the terminal.
 *
 * - If the input is a path, reads the file and converts its content.
 * - If the input is a URL, fetches the content and converts it.
 * - if the input is a string, converts it directly.
 * ---
 * @param {string} input - The HTML input to convert.
 * @returns {Promise<string>} - The formatted string.
 */
export const html2terminal = async ( input: string ): Promise<string> => {

	input = await _getInput( input )
	input = await html2md( input )
	marked.use( markedTerminal() as MarkedExtension )
	return await marked.parse( input )

}

/**
 * Parses the given Markdown string and returns an array of objects containing
 * the title, level and anchor for each header found.
 *
 * - If the input is a path, reads the file input.
 * - If the input is a URL, fetches the content.
 * - if the input is a string, gets it directly.
 * ---
 * @param {string} input - The Markdown input to parse.
 * @returns {Promise<object[]>} - An array of objects with the following properties:
 *   - `level`: The header level (1-6).
 *   - `title`: The header title.
 *   - `anchor`: The header anchor.
 */
export const getMDIndex = async ( input: string ) => {

	input             = await _getInput( input )
	const headerRegex = /^(#{1,6})\s+(.*)$/gm

	let match
	const index = []

	// Iterate over all headers found
	while ( ( match = headerRegex.exec( input ) ) !== null ) {

		const level  = match[1].length // Number of # indicates the header level
		const title  = match[2].trim()
		const anchor = title.toLowerCase().replace( /\s+/g, '-' ).replace( /[^\w-]+/g, '' ) // Create anchor

		index.push( {
			level,
			title,
			anchor,
		} )

	}

	return index

}

/**
 * Creates a Markdown index from the given Markdown string.
 *
 * - If the input is a path, reads the file input.
 * - If the input is a URL, fetches the content.
 * - if the input is a string, gets it directly.
 * ---
 * @param {string} input - The Markdown input to create an index from.
 * @param {string} title - The title of the index (default: 'Table of Contents').
 * @returns {string} - The generated Markdown index as a string.
 */
export const createMDIndex = async ( input: string, title: string = 'Table of Contents' ): Promise<string> => {

	let indexMarkdown: string
	const index = await getMDIndex( input )

	indexMarkdown = `## ${title}\n\n`

	index.forEach( item => {

		const indent   = '  '.repeat( item.level - 1 )
		indexMarkdown += `${indent}- [${item.title}](#${item.anchor})\n`

	} )

	return indexMarkdown

}
