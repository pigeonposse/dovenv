/* eslint-disable @stylistic/object-curly-newline */

import { defineConfig } from '@dovenv/core'
import { process }      from '@dovenv/core/utils'

import { Workspace } from './core/main'

import type { Config } from './core/_super/types'

export {
	Workspace,
	Config,
}

const getValuesAfter = ( array: string[], value: string ): string[] =>
	array.includes( value ) ? array.slice( array.indexOf( value ) + 1 ) : []
export const config = ( params?: Config ) => defineConfig( {
	custom : {
		ws : {
			desc : 'Toolkit for Workspace',
			cmds : {
				exec : {
					desc : 'Run a package without installing it',
					cmds : params?.exec,
				},
				audit : {
					desc : 'Audit the workspace dependencies.',
					opts : {
						fix : {
							type : 'boolean',
							desc : 'Add overrides to the package.json file in order to force non-vulnerable versions of the dependencies.',
						},
					},
				},
				check : {
					desc : 'Check for workspace structure rules.',
				},
				reinstall : {
					desc : 'Reinstall the workspace.',
				},
				info : {
					desc : 'Set information about the workspace',
					opts : {
						scripts : {
							type : 'array',
							desc : 'list workspace scripts from the package.json files',
						},
						cmds : {
							type : 'boolean',
							desc : 'Information for some useful commands',
						},
						size : {
							type : 'boolean',
							desc : 'Workspace size information',
						},
						donate : {
							type : 'boolean',
							desc : 'Donate information for PigeonPosse.',
						},
						instructions : {
							type : 'boolean',
							desc : 'Instructions for the workspace',
						},
					},
				},
			},
			fn : async ( {
				cmds,
				opts,
				showHelp,
				config,
			} ) => {

				try {

					// @ts-ignore
					const pp = new Workspace( params, config?.const )
					if ( cmds?.includes( 'info' ) ) {

						if ( opts?.instructions ) await pp.instructions()
						else if ( opts?.donate ) await pp.donate()
						else if ( opts?.size ) await pp.size()
						else if ( opts?.cmds ) await pp.usefulCmds()
						else if ( opts?.scripts ) await pp.scripts( opts?.scripts as string[] )
						else await pp.info()

					}
					else if ( cmds?.includes( 'audit' ) ) await pp.audit( ( opts?.fix as boolean ) )
					else if ( cmds?.includes( 'check' ) ) await pp.check()
					else if ( cmds?.includes( 'reinstall' ) ) await pp.reinstall()
					else if ( cmds?.includes( 'exec' ) ) {

						const values = getValuesAfter( process.argv, 'exec' )
						const cmd    = values[0]
						const opts   = values.slice( 1 )
						await pp.exec( cmds?.includes( 'exec' ) ? cmd : '', opts )

					}
					else await showHelp()

				}
				catch ( e ) {

					// @ts-ignore
					console.error( e?.message || e )

				}

			},
		},
	},
} )
