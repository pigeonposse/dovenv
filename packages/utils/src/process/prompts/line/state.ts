
import process from 'node:process'

import { color } from '../../../styles/main'

import type { State } from '@clack/core'

export { State }

const isUnicodeSupported = () => {

	if ( process.platform !== 'win32' ) return process.env.TERM !== 'linux' // Linux console (kernel)

	return Boolean( process.env.WT_SESSION ) // Windows Terminal
		|| Boolean( process.env.TERMINUS_SUBLIME ) // Terminus (<0.2.27)
		|| process.env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
		|| process.env.TERM_PROGRAM === 'Terminus-Sublime'
		|| process.env.TERM_PROGRAM === 'vscode'
		|| process.env.TERM === 'xterm-256color'
		|| process.env.TERM === 'alacritty'
		|| process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'

}

const unicode = isUnicodeSupported()
const s       = ( c: string, fallback: string ) => ( unicode ? c : fallback )

export const symbols = {
	STEP_ACTIVE : s( '◆', '*' ),
	STEP_CANCEL : s( '■', 'x' ),
	STEP_ERROR  : s( '▲', 'x' ),
	STEP_SUBMIT : s( '◇', 'o' ),
	BAR_START   : s( '┌', 'T' ),
	BAR         : s( '│', '|' ),
	BAR_END     : s( '└', '—' ),
}

// symbols.RADIO_ACTIVE      = s( '●', '>' )
// symbols.RADIO_INACTIVE    = s( '○', ' ' )
// symbols.CHECKBOX_ACTIVE   = s( '◻', '[•]' )
// symbols.CHECKBOX_SELECTED = s( '◼', '[+]' )
// symbols.CHECKBOX_INACTIVE = s( '◻', '[ ]' )
// symbols.PASSWORD_MASK     = s( '▪', '•' )

// symbols.BAR_H               = s( '─', '-' )
// symbols.CORNER_TOP_RIGHT    = s( '╮', '+' )
// symbols.CONNECT_LEFT        = s( '├', '+' )
// symbols.CORNER_BOTTOM_RIGHT = s( '╯', '+' )

// symbols.INFO    = s( '●', '•' )
// symbols.SUCCESS = s( '◆', '*' )
// symbols.WARN    = s( '▲', '!' )
// symbols.ERROR   = s( '■', 'x' )

export const symbol = ( state: State ) => {

	if ( state === 'initial' || state === 'active' )
		return color.cyan( symbols.STEP_ACTIVE )
	else if ( state === 'cancel' )
		return color.red( symbols.STEP_CANCEL )
	else if ( state === 'error' )
		return color.yellow( symbols.STEP_ERROR )
	else if ( state === 'submit' )
		return color.green( symbols.STEP_SUBMIT )

}

