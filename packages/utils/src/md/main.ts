import { marked }         from 'marked'
import { markedTerminal } from 'marked-terminal'

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
 * Reads a Markdown file from the specified path and prints its content.
 * @param {string} path - The path to the Markdown file.
 * @returns {Promise<string>} - The formatted Markdown as a string.
 */
export const printMDFromPath = async ( path: string ): Promise<string> => {

	const content = await readFile( path, 'utf-8' )
	return await printMD( content )

}

/**
 * Converts Markdown string to HTML.
 * @param {string} string - The Markdown string to convert.
 * @returns {string} - The converted HTML string.
 */
export const mdToHTML = async  ( string: string ) => await marked( string )

/**
 * Returns the Markdown to the terminal with formatting.
 * @param {string} string - The Markdown string to print.
 * @returns {Promise<string>} - The formatted Markdown as a string.
 */
export const printMD = async ( string: string ): Promise<string> => {

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
