#!/usr/bin/env node

import {
	core,
	createTemplate,
} from './core'

import type { CreateTemplateParams } from './core'

const run = async () => {

	const res = await core.cli()
	await createTemplate( res as CreateTemplateParams )

}
run()
