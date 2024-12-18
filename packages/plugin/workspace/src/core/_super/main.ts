
import { PluginCore } from '@dovenv/core'
import { joinUrl }    from '@dovenv/core/utils'

import { homepage } from '../../../package.json'

import type { Config }     from './types'
import type { catchError } from '@dovenv/core/utils'

export class Super extends PluginCore<Config> {

	title = 'ws'
	helpURL = homepage

	protected _themeInfo = `Theme info:

	For using this theme, you need to add "pkg" and "workspaceDir" in the section "const" in your dovenv configuration.
	Also you nedd to add "engines" to your package.json and add your runtime. Example: "engines": { "node": ">=16" }.

	Read more: ${joinUrl( this.helpURL )}`

	protected _cmdsList = {
		pnpm : {
			audit    : 'pnpm audit',
			auditFix : 'pnpm audit --fix',
			outdated : 'pnpm -r outdated',
			upDeps   : 'pnpm -r up',
			exec     : 'pnpx',
			install  : 'pnpm install',
		},
		npm : {
			audit    : 'npm audit',
			auditFix : 'npm audit fix',
			outdated : 'npm outdated',
			upDeps   : 'npm update',
			exec     : 'npx',
			install  : 'npm install',
		},
		yarn : {
			audit    : 'yarn audit',
			auditFix : 'yarn audit fix',
			outdated : 'yarn outdated',
			upDeps   : 'yarn upgrade',
			exec     : 'yarn dlx',
			install  : 'yarn install',
		},
		bun : {
			audit    : 'bun audit',
			auditFix : 'bun audit fix',
			outdated : 'bun outdated',
			upDeps   : 'bun update',
			exec     : 'bunx',
			install  : 'bun install',
		},
	}

	protected _title( title: string ) {

		console.log( this.style.section.h( title ) + '\n'  )

	}

	protected _sectionTitle( title: string ) {

		console.log()
		console.info( this.style.section.h( title ) )

	}

	async _envolvefn( fn: Parameters<typeof catchError>[0] ) {

		return await this.catchFn( fn )

	}

}
