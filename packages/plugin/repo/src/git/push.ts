/**
 * TODO prompt.
 * @description Add prompt for edit project TODO List.
 */

import {
	exec,
	execProcess,
	joinUrl,
	paths,
	prompt,
	readJSON,
	initCache,
} from '@dovenv/utils'

await execProcess( {
	name : 'PUSH REPO',
	on   : async ( { log } ) => {

		const data = {
			update   : 'update',
			add      : 'add',
			origin   : 'origin',
			workflow : 'workflow',
		}

		const cache = await initCache( {
			id     : 'push',
			values : {
				[data.update]   : false,
				[data.add]      : '.',
				[data.origin]   : 'main',
				[data.workflow] : false,
			},
		} )

		const getRepoUrl = async () => {

			const packageJsonPath = paths.workspacePkg
			const packageJson     = await readJSON( packageJsonPath )
			return joinUrl( packageJson.repository.url )

		}
		const preAnswer = await prompt( [
			{
				type    : 'confirm',
				name    : data.update,
				default : cache.get( data.update ),
				message : 'Do yo want update version?',
			},
		] )

		if ( preAnswer.update ) await import( '../update/update-version.mjs' )

		const answers = await prompt( [
			{
				type    : 'input',
				name    : data.add,
				default : cache.get( data.add ),
				message : 'Git add',
			},
			{
				type    : 'input',
				name    : data.origin,
				default : cache.get( data.origin ),
				message : 'Add origin branch',
			},
		] )

		await exec( `git add ${answers.add} && pnpm cm && git push -f origin ${answers.origin}` )

		log.success( `Successfully commit to ${await getRepoUrl()}\n` )

		const answersAfter = await prompt( [
			{
				type    : 'confirm',
				name    : data.workflow,
				default : cache.get( data.workflow ),
				message : 'Run workflow',
			},
		] )

		cache.set( answers )
		if ( answersAfter.workflow ) await import( './workflow.mjs' )

	},
} )

