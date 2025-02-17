/* eslint-disable @stylistic/object-curly-newline */

import { defineConfig } from '@dovenv/core'

import { Checks }    from './core/checks'
import { Workspace } from './core/main'

import type { Config } from './core/_super/types'

export {
	Workspace,
	Config,
}

/**
 * Workspace plugin for Dovenv.
 * @param {Config} [params] - Plugin config.
 * @returns {import('@dovenv/core').Config} - A config with commands for workspace.
 * @example
 * import { defineConfig } from '@dovenv/core'
 * import { workspacePlugin } from '@dovenv/workspace'
 *
 * export default defineConfig( workspacePlugin() )
 */
export const workspacePlugin = ( params?: Config ) => defineConfig( {
	check : {
		ws : {
			type : 'custom',
			desc : 'Check for workspace structure rules',
			fn   : async ( { utils } ) => {

				const check = new Checks( params, utils )
				await check.run()

			},
		},
	},
	custom : {
		ws : {
			desc : 'Toolkit for Workspace',
			cmds : {
				audit : {
					desc : 'Audit the workspace dependencies.',
					opts : {
						fix : {
							type : 'boolean',
							desc : 'Add overrides to the package.json file in order to force non-vulnerable versions of the dependencies.',
						},
					},
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
						structure : {
							type : 'boolean',
							desc : 'Structure information for the workspace',
						},
					},
				},
				custom : {
					desc : 'Run custom workspace function',
					opts : { key : {
						alias : 'k',
						desc  : 'Key pattern',
						type  : 'array',
					} },
				},
			},
			fn : async ( {
				cmds,
				opts,
				showHelp,
				utils,
			} ) => {

				try {

					const ws = new Workspace( {
						opts : params,
						utils,
					} )

					if ( cmds?.includes( 'info' ) ) {

						if ( opts?.instructions ) await ws.instructions()
						else if ( opts?.structure ) await ws.structure()
						else if ( opts?.donate ) await ws.donate()
						else if ( opts?.size ) await ws.size()
						else if ( opts?.cmds ) await ws.usefulCmds()
						else if ( opts?.scripts ) await ws.scripts( opts?.scripts as string[] )
						else await ws.info()

					}
					else if ( cmds?.includes( 'audit' ) ) await ws.audit( ( opts?.fix as boolean ) )
					// else if ( cmds?.includes( 'check' ) ) await ws.check()
					else if ( cmds?.includes( 'reinstall' ) ) await ws.reinstall()
					else if ( cmds?.includes( 'custom' ) ) await ws.custom()
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

export default workspacePlugin
