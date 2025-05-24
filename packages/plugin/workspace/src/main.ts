/* eslint-disable @stylistic/object-curly-newline */

import { defineConfig } from '@dovenv/core'

import { Checks }    from './core/checks'
import { Workspace } from './core/main'

import type { Config } from './core/_super/types'

export {
	Workspace,
	Config,
}

type CustomConfig = NonNullable<Config['custom']>

const splitCustom = ( config?: CustomConfig ) => {

	const onlyFn: Record<string, CustomConfig[number]['fn']>          = {}
	const withoutFn: Record<string, Omit<CustomConfig[number], 'fn'>> = {}
	if ( !config ) return {
		onlyFn    : undefined,
		withoutFn : undefined,
	}
	for ( const key in config ) {

		const { fn, ...rest } = config[key]
		onlyFn[key]           = fn
		withoutFn[key]        = rest

	}

	return {
		onlyFn,
		withoutFn,
	}

}
/**
 * Workspace plugin for Dovenv.
 *
 * @param   {Config}                        [params] - Plugin config.
 * @returns {import('@dovenv/core').Config}          - A config with commands for workspace.
 * @example
 * import { defineConfig } from '@dovenv/core'
 * import { workspacePlugin } from '@dovenv/workspace'
 *
 * export default defineConfig( workspacePlugin() )
 */
export const workspacePlugin = ( params?: Config ) => {

	const custom = splitCustom( params?.custom )

	return defineConfig( {
		check : params?.check?.pkg
			? Object.fromEntries( Object.entries( params.check.pkg ).map(
				( [ k, v ] ) => [
					`ws.pkg.${k}`,
					{
						type : 'custom',
						desc : v.desc ? `Check workspace rules: ${v.desc}` : 'Check workspace rules',
						fn   : async ( { utils } ) => {

							const check = new Checks( params, utils )
							await check.runOne( v )

						},
					},
				],
			) )
			: undefined,
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
					outdated : {
						desc : 'Check for outdated packages.',
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
					...( custom.withoutFn || {} ),

				},

				fn : async data => {

					try {

						const {
							cmds,
							opts,
							showHelp,
							utils,
						} = data

						const ws = new Workspace( {
							opts : params,
							utils,
						} )

						const actions: {
							key : string
							fn  : () => Promise<void>
						}[] =  [
							{
								key : 'audit',
								fn  : async () => await ws.audit( ( opts?.fix as boolean ) ),
							},
							{
								key : 'outdated',
								fn  : async () => await ws.outdated( ),
							},
							{
								key : 'reinstall',
								fn  : async () => await ws.reinstall(),
							},
							{
								key : 'info',
								fn  : async () => {

									if ( opts?.instructions ) await ws.instructions()
									else if ( opts?.structure ) await ws.structure()
									else if ( opts?.donate ) await ws.donate()
									else if ( opts?.size ) await ws.size()
									else if ( opts?.cmds ) await ws.usefulCmds()
									else if ( opts?.scripts ) await ws.scripts( opts?.scripts as string[] )
									else await ws.info()

								},
							},
						]

						if ( custom.onlyFn ) for ( const key in custom.onlyFn ) actions.push( {
							key,
							fn : async () => await custom.onlyFn[key]( data ),
						} )

						for ( const action of actions ) {

							if ( cmds?.includes( action.key ) ) {

								await action.fn()
								return

							}

						}
						await showHelp()

					}
					catch ( e ) {

						// @ts-ignore
						console.error( e?.message || e )

					}

				},
			},
		},
	} )

}
export default workspacePlugin
