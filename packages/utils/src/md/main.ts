import { marked }         from 'marked'
import { markedTerminal } from 'marked-terminal'
import TurndownService    from 'turndown'

import { readFile } from '../sys/super/main'

import type { MarkedExtension } from 'marked'

/**
 * Reads a Markdown file from the specified path and prints its content.
 * @param {string} path - The path to the Markdown file.
 * @returns {Promise<string>} - The formatted Markdown as a string.
 */
export const readMD = async ( path: string ): Promise<string> => {

	const content = await readFile( path, 'utf-8' )
	return content

}

/**
 * Reads a Markdown file from the specified path and converts it to a formatted string suitable for the terminal.
 * @param {string} path - The path to the Markdown file.
 * @returns {Promise<string>} - The formatted Markdown as a string.
 */
export const formatMDForTerminalFromPath = async ( path: string ): Promise<string> => {

	const content = await readFile( path, 'utf-8' )
	return await formatMDForTerminal( content )

}

/**
 * Converts Markdown string to HTML.
 * @param {string} string - The Markdown string to convert.
 * @returns {string} - The converted HTML string.
 */
export const md2html = async  ( string: string ) => await marked( string )

export const html2md = async ( html: string ) => {

	const turndownService = new TurndownService()
	return turndownService.turndown( html )

}

export const formatHTMLForTerminal = async ( string: string ): Promise<string> => {

	string = await html2md( string )
	marked.use( markedTerminal() as MarkedExtension )
	return await marked.parse( string )

}

/**
 * Converts a Markdown string to a formatted string suitable for the terminal.
 * @param {string} string - The Markdown string to convert.
 * @returns {Promise<string>} - The formatted string as a promise.
 */
export const formatMDForTerminal = async ( string: string ): Promise<string> => {

	marked.use( markedTerminal() as MarkedExtension )
	return await marked.parse( string )

}

/**
 * Creates a Markdown index from the given Markdown string.
 * @param {string} markdown - The Markdown string to create an index from.
 * @param {string} title - The title of the index (default: 'Table of Contents').
 * @returns {string} - The generated Markdown index as a string.
 */
export const createMDIndex = ( markdown: string, title: string = 'Table of Contents' ): string => {

	const headerRegex = /^(#{1,6})\s+(.*)$/gm

	let match, indexMarkdown: string
	const index = []

	// Iterate over all headers found
	while ( ( match = headerRegex.exec( markdown ) ) !== null ) {

		const level  = match[1].length // Number of # indicates the header level
		const title  = match[2].trim()
		const anchor = title.toLowerCase().replace( /\s+/g, '-' ).replace( /[^\w-]+/g, '' ) // Create anchor

		index.push( {
			level,
			title,
			anchor,
		} )

	}

	indexMarkdown = `## ${title}\n\n`

	index.forEach( item => {

		const indent   = '  '.repeat( item.level - 1 )
		indexMarkdown += `${indent}- [${item.title}](#${item.anchor})\n`

	} )

	return indexMarkdown

}
