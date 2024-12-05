#!/usr/bin/env node

import {
	createCli,
	process,
	hideBin,
} from '@dovenv/core/utils'

import { Docs } from './run'

await createCli( {
	args : hideBin( process.argv ),
	fn   : async cli => {

		cli
			.option( 'config', {
				alias    : 'c',
				describe : 'Configuration file path',
				type     : 'string',
			} )
			.option( 'verbose', {
				describe : 'Verbose mode',
				type     : 'boolean',
			} )
			.command( 'build', 'Run the build process', () => {}, async argvChild => {

				const docs = new Docs( undefined, {
					configPath : argvChild.config,
					debug      : argvChild.verbose,
				} )

				await docs.build()

			} )
			.command( 'dev', 'Run the dev server', () => {}, async argvChild => {

				const docs = new Docs( undefined, {
					configPath : argvChild.config,
					debug      : argvChild.verbose,
				} )

				await docs.dev()

			} )
			.command( 'preview', 'Run the preview server', () => {}, async argvChild => {

				const docs = new Docs( undefined, {
					configPath : argvChild.config,
					debug      : argvChild.verbose,
				} )

				await docs.preview()

			} )
			.demandCommand( 1, 'You need to specify a command (build, dev, or preview)' )

		return cli

	},
} )
