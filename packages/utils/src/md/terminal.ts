/* eslint-disable prefer-rest-params */
/* eslint-disable no-useless-escape */
/* eslint-disable one-var */
/* eslint-disable no-control-regex */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/**
 * Fork of https://github.com/mikaelbr/marked-terminal/blob/master/index.js
 */

import {
	CardinalOptions,
	TerminalRendererOptions,
} from './terminal.types'

import { supportsHyperlinks } from '@/process'
import {
	ansiEscapes,
	ansiRegex,
	emoji,
} from '@/string'
import {
	color as chalk,
	highlight as highlightCli,
	Table,
} from '@/styles'

const TABLE_CELL_SPLIT       = '^*||*^'
const TABLE_ROW_WRAP         = '*|*|*|*'
const TABLE_ROW_WRAP_REGEXP  = new RegExp( escapeRegExp( TABLE_ROW_WRAP ), 'g' )
const COLON_REPLACER         = '*#COLON|*'
const COLON_REPLACER_REGEXP  = new RegExp( escapeRegExp( COLON_REPLACER ), 'g' )
const TAB_ALLOWED_CHARACTERS = [ '\t' ]
const ANSI_REGEXP            = ansiRegex()

// HARD_RETURN holds a character sequence used to indicate text has a
// hard (no-reflowing) line break.  Previously \r and \r\n were turned
// into \n in marked's lexer- preprocessing step. So \r is safe to use
// to indicate a hard (non-reflowed) return.
const HARD_RETURN        = '\r'
const HARD_RETURN_RE     = new RegExp( HARD_RETURN )
const HARD_RETURN_GFM_RE = new RegExp( HARD_RETURN + '|<br />' )

const defaultOptions = {
	code              : chalk.yellow,
	blockquote        : chalk.gray.italic,
	html              : chalk.gray,
	heading           : chalk.green.bold,
	firstHeading      : chalk.magenta.underline.bold,
	hr                : chalk.reset,
	listitem          : chalk.reset,
	list              : list,
	table             : chalk.reset,
	paragraph         : chalk.reset,
	strong            : chalk.bold,
	em                : chalk.italic,
	codespan          : chalk.yellow,
	del               : chalk.dim.gray.strikethrough,
	link              : chalk.blue,
	href              : chalk.blue.underline,
	text              : identity,
	unescape          : true,
	emoji             : true,
	width             : 80,
	showSectionPrefix : true,
	reflowText        : false,
	tab               : 4,
	tableOptions      : {},
}

function Renderer( options?: TerminalRendererOptions, highlightOptions?: CardinalOptions ) {

	this.o                = Object.assign( {}, defaultOptions, options )
	this.tab              = sanitizeTab( this.o.tab, defaultOptions.tab )
	this.tableSettings    = this.o.tableOptions
	this.emoji            = this.o.emoji ? insertEmojis : identity
	this.unescape         = this.o.unescape ? unescapeEntities : identity
	this.highlightOptions = highlightOptions || {}

	this.transform = compose( undoColon, this.unescape, this.emoji )

}

// Compute length of str not including ANSI escape codes.
// See http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
function textLength( str: string ) {

	return str.replace( ANSI_REGEXP, '' ).length

}

Renderer.prototype.textLength = textLength

function fixHardReturn( text, reflow ) {

	return reflow ? text.replace( HARD_RETURN, /\n/g ) : text

}

Renderer.prototype.space = function () {

	return ''

}

Renderer.prototype.text = function ( text ) {

	if ( typeof text === 'object' ) {

		text = text.text

	}
	return this.o.text( text )

}

Renderer.prototype.code = function ( code, lang, escaped ) {

	if ( typeof code === 'object' ) {

		lang    = code.lang
		escaped = !!code.escaped
		code    = code.text

	}
	return section(
		indentify( this.tab, highlight( code, lang, this.o, this.highlightOptions ) ),
	)

}

Renderer.prototype.blockquote = function ( quote ) {

	if ( typeof quote === 'object' ) {

		quote = this.parser.parse( quote.tokens )

	}
	return section( this.o.blockquote( indentify( this.tab, quote.trim() ) ) )

}

Renderer.prototype.html = function ( html ) {

	if ( typeof html === 'object' ) {

		html = html.text

	}
	return this.o.html( html )

}

Renderer.prototype.heading = function ( text, level ) {

	if ( typeof text === 'object' ) {

		level = text.depth
		text  = this.parser.parseInline( text.tokens )

	}
	text = this.transform( text )

	const prefix = this.o.showSectionPrefix
		? new Array( level + 1 ).join( '#' ) + ' '
		: ''
	text         = prefix + text
	if ( this.o.reflowText ) {

		text = reflowText( text, this.o.width, this.options.gfm )

	}
	return section(
		level === 1 ? this.o.firstHeading( text ) : this.o.heading( text ),
	)

}

Renderer.prototype.hr = function () {

	return section( this.o.hr( hr( '-', this.o.reflowText && this.o.width ) ) )

}

Renderer.prototype.list = function ( body, ordered ) {

	if ( typeof body === 'object' ) {

		const listToken = body
		const start     = listToken.start
		const loose     = listToken.loose

		ordered = listToken.ordered
		body    = ''
		for ( let j = 0; j < listToken.items.length; j++ ) {

			body += this.listitem( listToken.items[j] )

		}

	}
	body = this.o.list( body, ordered, this.tab )
	return section( fixNestedLists( indentLines( this.tab, body ), this.tab ) )

}

Renderer.prototype.listitem = function ( text ) {

	if ( typeof text === 'object' ) {

		const item = text
		text       = ''
		if ( item.task ) {

			const checkbox = this.checkbox( { checked: !!item.checked } )
			if ( item.loose ) {

				if ( item.tokens.length > 0 && item.tokens[0].type === 'paragraph' ) {

					item.tokens[0].text = checkbox + ' ' + item.tokens[0].text
					if (
						item.tokens[0].tokens
						&& item.tokens[0].tokens.length > 0
						&& item.tokens[0].tokens[0].type === 'text'
					) {

						item.tokens[0].tokens[0].text
              = checkbox + ' ' + item.tokens[0].tokens[0].text

					}

				}
				else {

					item.tokens.unshift( {
						type : 'text',
						raw  : checkbox + ' ',
						text : checkbox + ' ',
					} )

				}

			}
			else {

				text += checkbox + ' '

			}

		}

		text += this.parser.parse( item.tokens, !!item.loose )

	}
	const transform = compose( this.o.listitem, this.transform )
	const isNested  = text.indexOf( '\n' ) !== -1
	if ( isNested ) text = text.trim()

	// Use BULLET_POINT as a marker for ordered or unordered list item
	return '\n' + BULLET_POINT + transform( text )

}

Renderer.prototype.checkbox = function ( checked ) {

	if ( typeof checked === 'object' ) {

		checked = checked.checked

	}
	return '[' + ( checked ? 'X' : ' ' ) + '] '

}

Renderer.prototype.paragraph = function ( text ) {

	if ( typeof text === 'object' ) {

		text = this.parser.parseInline( text.tokens )

	}
	const transform = compose( this.o.paragraph, this.transform )
	text            = transform( text )
	if ( this.o.reflowText ) {

		text = reflowText( text, this.o.width, this.options.gfm )

	}
	return section( text )

}

Renderer.prototype.table = function ( header, body ) {

	if ( typeof header === 'object' ) {

		const token = header
		header      = ''

		// header
		let cell = ''
		for ( let j = 0; j < token.header.length; j++ ) {

			cell += this.tablecell( token.header[j] )

		}
		header += this.tablerow( { text: cell } )

		body = ''
		for ( let j = 0; j < token.rows.length; j++ ) {

			const row = token.rows[j]

			cell = ''
			for ( let k = 0; k < row.length; k++ ) {

				cell += this.tablecell( row[k] )

			}

			body += this.tablerow( { text: cell } )

		}

	}
	var table = new Table(
		Object.assign(
			{},
			{ head: generateTableRow( header )[0] },
			this.tableSettings,
		),
	)

	generateTableRow( body, this.transform ).forEach( row => {

		table.push( row )

	} )
	return section( this.o.table( table.toString() ) )

}

Renderer.prototype.tablerow = function ( content ) {

	if ( typeof content === 'object' ) {

		content = content.text

	}
	return TABLE_ROW_WRAP + content + TABLE_ROW_WRAP + '\n'

}

Renderer.prototype.tablecell = function ( content ) {

	if ( typeof content === 'object' ) {

		content = this.parser.parseInline( content.tokens )

	}
	return content + TABLE_CELL_SPLIT

}

// span level renderer
Renderer.prototype.strong = function ( text ) {

	if ( typeof text === 'object' ) {

		text = this.parser.parseInline( text.tokens )

	}
	return this.o.strong( text )

}

Renderer.prototype.em = function ( text ) {

	if ( typeof text === 'object' ) {

		text = this.parser.parseInline( text.tokens )

	}
	text = fixHardReturn( text, this.o.reflowText )
	return this.o.em( text )

}

Renderer.prototype.codespan = function ( text ) {

	if ( typeof text === 'object' ) {

		text = text.text

	}
	text = fixHardReturn( text, this.o.reflowText )
	return this.o.codespan( text.replace( /:/g, COLON_REPLACER ) )

}

Renderer.prototype.br = function () {

	return this.o.reflowText ? HARD_RETURN : '\n'

}

Renderer.prototype.del = function ( text ) {

	if ( typeof text === 'object' ) {

		text = this.parser.parseInline( text.tokens )

	}
	return this.o.del( text )

}

Renderer.prototype.link = function ( href, title, text ) {

	if ( typeof href === 'object' ) {

		title = href.title
		text  = this.parser.parseInline( href.tokens )
		href  = href.href

	}

	if ( this.options.sanitize ) {

		try {

			var prot = decodeURIComponent( unescape( href ) )
				.replace( /[^\w:]/g, '' )
				.toLowerCase()

		}
		catch ( e ) {

			return ''

		}
		if ( prot.indexOf( 'javascript:' ) === 0 ) {

			return ''

		}

	}

	let hasText = text && text !== href,
		out = ''

	if ( supportsHyperlinks.stdout ) {

		let link = ''
		if ( text ) {

			link = this.o.href( this.emoji( text ) )

		}
		else {

			link = this.o.href( href )

		}
		out = ansiEscapes.link(
			link,
			href
			// textLength breaks on '+' in URLs
				.replace( /\+/g, '%20' ),
		)

	}
	else {

		if ( hasText ) out += this.emoji( text ) + ' ('
		out += this.o.href( href )
		if ( hasText ) out += ')'

	}
	return this.o.link( out )

}

Renderer.prototype.image = function ( href, title, text ) {

	if ( typeof href === 'object' ) {

		title = href.title
		text  = href.text
		href  = href.href

	}

	if ( typeof this.o.image === 'function' ) {

		return this.o.image( href, title, text )

	}
	let out = '![' + text
	if ( title ) out += ' - ' + title
	return out + '](' + href + ')\n'

}

export function markedTerminal( options?: TerminalRendererOptions, highlightOptions?: CardinalOptions ) {

	const r = new Renderer( options, highlightOptions )

	const funcs = [
		'text',
		'code',
		'blockquote',
		'html',
		'heading',
		'hr',
		'list',
		'listitem',
		'checkbox',
		'paragraph',
		'table',
		'tablerow',
		'tablecell',
		'strong',
		'em',
		'codespan',
		'br',
		'del',
		'link',
		'image',
	]

	return funcs.reduce(
		( extension, func ) => {

			extension.renderer[func] = function ( ...args ) {

				r.options = this.options
				r.parser  = this.parser
				return r[func]( ...args )

			}
			return extension

		},
		{
			renderer       : {},
			useNewRenderer : true,
		},
	)

}

// Munge \n's and spaces in "text" so that the number of
// characters between \n's is less than or equal to "width".
function reflowText( text, width, gfm ) {

	// Hard break was inserted by Renderer.prototype.br or is
	// <br /> when gfm is true
	const splitRe  = gfm ? HARD_RETURN_GFM_RE : HARD_RETURN_RE
	const sections = text.split( splitRe )
	const reflowed = []

	sections.forEach( section => {

		// Split the section by escape codes so that we can
		// deal with them separately.
		let fragments = section.split( /(\u001b\[(?:\d{1,3})(?:;\d{1,3})*m)/g ),
			column = 0,
			currentLine = '',
			lastWasEscapeChar = false

		while ( fragments.length ) {

			const fragment = fragments[0]

			if ( fragment === '' ) {

				fragments.splice( 0, 1 )
				lastWasEscapeChar = false
				continue

			}

			// This is an escape code - leave it whole and
			// move to the next fragment.
			if ( !textLength( fragment ) ) {

				currentLine += fragment
				fragments.splice( 0, 1 )
				lastWasEscapeChar = true
				continue

			}

			const words = fragment.split( /[ \t\n]+/ )

			for ( let i = 0; i < words.length; i++ ) {

				let word = words[i],
					addSpace = column != 0
				if ( lastWasEscapeChar ) addSpace = false

				// If adding the new word overflows the required width
				if ( column + word.length + addSpace > width ) {

					if ( word.length <= width ) {

						// If the new word is smaller than the required width
						// just add it at the beginning of a new line
						reflowed.push( currentLine )
						currentLine = word
						column      = word.length

					}
					else {

						// If the new word is longer than the required width
						// split this word into smaller parts.
						var w = word.substr( 0, width - column - addSpace )
						if ( addSpace ) currentLine += ' '
						currentLine += w
						reflowed.push( currentLine )
						currentLine = ''
						column      = 0

						word = word.substr( w.length )
						while ( word.length ) {

							var w = word.substr( 0, width )

							if ( !w.length ) break

							if ( w.length < width ) {

								currentLine = w
								column      = w.length
								break

							}
							else {

								reflowed.push( w )
								word = word.substr( width )

							}

						}

					}

				}
				else {

					if ( addSpace ) {

						currentLine += ' '
						column++

					}

					currentLine += word
					column      += word.length

				}

				lastWasEscapeChar = false

			}

			fragments.splice( 0, 1 )

		}

		if ( textLength( currentLine ) ) reflowed.push( currentLine )

	} )

	return reflowed.join( '\n' )

}

function indentLines( indent, text ) {

	return text.replace( /(^|\n)(.+)/g, '$1' + indent + '$2' )

}

function indentify( indent, text ) {

	if ( !text ) return text
	return indent + text.split( '\n' ).join( '\n' + indent )

}

const BULLET_POINT_REGEX   = '\\*'
const NUMBERED_POINT_REGEX = '\\d+\\.'
const POINT_REGEX
  = '(?:' + [ BULLET_POINT_REGEX, NUMBERED_POINT_REGEX ].join( '|' ) + ')'

// Prevents nested lists from joining their parent list's last line
function fixNestedLists( body, indent ) {

	const regex = new RegExp(
		''
		+ '(\\S(?: |  )?)' // Last char of current point, plus one or two spaces
		// to allow trailing spaces
		+ '((?:'
		+ indent
		+ ')+)' // Indentation of sub point
		+ '('
		+ POINT_REGEX
		+ '(?:.*)+)$',
		'gm',
	) // Body of subpoint
	return body.replace( regex, '$1\n' + indent + '$2$3' )

}

const isPointedLine =  ( line, indent ) => {

	return line.match( '^(?:' + indent + ')*' + POINT_REGEX )

}

function toSpaces( str ) {

	return ' '.repeat( str.length )

}

var BULLET_POINT = '* '
function bulletPointLine( indent, line ) {

	return isPointedLine( line, indent ) ? line : toSpaces( BULLET_POINT ) + line

}

function bulletPointLines( lines, indent ) {

	const transform = bulletPointLine.bind( null, indent )
	return lines.split( '\n' ).filter( identity ).map( transform ).join( '\n' )

}

const numberedPoint =  n => {

	return n + '. '

}
function numberedLine( indent, line, num ) {

	return isPointedLine( line, indent )
		? {
			num  : num + 1,
			line : line.replace( BULLET_POINT, numberedPoint( num + 1 ) ),
		}
		: {
			num  : num,
			line : toSpaces( numberedPoint( num ) ) + line,
		}

}

function numberedLines( lines, indent ) {

	const transform = numberedLine.bind( null, indent )
	let num         = 0
	return lines
		.split( '\n' )
		.filter( identity )
		.map( line => {

			const numbered = transform( line, num )
			num            = numbered.num

			return numbered.line

		} )
		.join( '\n' )

}

function list( body, ordered, indent ) {

	body = body.trim()
	body = ordered ? numberedLines( body, indent ) : bulletPointLines( body, indent )
	return body

}

function section( text ) {

	return text + '\n\n'

}

function highlight( code, language, opts, hightlightOpts ) {

	if ( chalk.level === 0 ) return code

	const style = opts.code

	code = fixHardReturn( code, opts.reflowText )

	try {

		return highlightCli( code, Object.assign( {}, { language }, hightlightOpts ) )

	}
	catch ( e ) {

		return style( code )

	}

}

function insertEmojis( text ) {

	return text.replace( /:([A-Za-z0-9_\-\+]+?):/g, emojiString => {

		const emojiSign = emoji.get( emojiString )
		if ( !emojiSign ) return emojiString
		return emojiSign + ' '

	} )

}

function hr( inputHrStr, length ) {

	length = length || process.stdout.columns
	return new Array( length ).join( inputHrStr )

}

function undoColon( str ) {

	return str.replace( COLON_REPLACER_REGEXP, ':' )

}

function generateTableRow( text, escape ) {

	if ( !text ) return []
	escape      = escape || identity
	const lines = escape( text ).split( '\n' )

	const data = []
	lines.forEach( line => {

		if ( !line ) return
		const parsed = line
			.replace( TABLE_ROW_WRAP_REGEXP, '' )
			.split( TABLE_CELL_SPLIT )

		data.push( parsed.splice( 0, parsed.length - 1 ) )

	} )
	return data

}

function escapeRegExp( str ) {

	return str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' )

}

function unescapeEntities( html ) {

	return html
		.replace( /&amp;/g, '&' )
		.replace( /&lt;/g, '<' )
		.replace( /&gt;/g, '>' )
		.replace( /&quot;/g, '"' )
		.replace( /&#39;/g, '\'' )

}

function identity( str ) {

	return str

}

function compose() {

	const funcs = arguments
	return function () {

		let args = arguments
		for ( let i = funcs.length; i-- > 0; ) {

			args = [ funcs[i].apply( this, args ) ]

		}
		return args[0]

	}

}

function isAllowedTabString( string ) {

	return TAB_ALLOWED_CHARACTERS.some( char => {

		return string.match( '^(' + char + ')+$' )

	} )

}

function sanitizeTab( tab, fallbackTab ) {

	if ( typeof tab === 'number' ) {

		return new Array( tab + 1 ).join( ' ' )

	}
	else if ( typeof tab === 'string' && isAllowedTabString( tab ) ) {

		return tab

	}
	else {

		return new Array( fallbackTab + 1 ).join( ' ' )

	}

}
