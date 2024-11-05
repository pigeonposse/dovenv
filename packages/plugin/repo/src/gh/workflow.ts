
/**
 * TODO prompt.
 * @description Add prompt for edit project TODO List.
 */

import {
	cache as initCache,
	execChild,
	getFilteredFileNames,
	promptLine,
	process,
	joinPath,
	joinUrl,
	getPaths,
	getDirectoryTreeFromPath,
	box,
} from '@dovenv/utils'

import { Repo } from '../_super/main'

export class Workflow extends Repo {

	async list() {

		const {
			workflowsDir, repoURL,
		} = this.opts || {}
		const dir       = workflowsDir || joinPath( process.cwd(), '.github', 'workflows' )
		const fileNames = await getPaths( [ dir + '/*.yml' ], { onlyFiles: true  } )
		const color     = this.color
		let content     = ( fileNames && fileNames.length )
			? await getDirectoryTreeFromPath( {
				name  : '.github/workflows\n',
				input : dir,
			} )
			: color.cyan( `No workflows found it!` )

		content  += '\n' + ( color.cyan( `PATH: ` ) + color.dim.italic( dir ) )
		content  += ( repoURL )  ? '\n' + color.cyan( `URL: ` ) + color.dim.italic( repoURL ) : ''
		const res = box( content, {
			title       : 'Workflows',
			padding     : 1,
			dimBorder   : true,
			borderColor : 'gray',
		} )
		console.log( res )

	}

	async run() {

		const {
			workflowDefaultInputs, workflowsDir, repoURL, repoID,
		} = this.opts || {}
		const dir = workflowsDir || joinPath( process.cwd(), '.github', 'workflows' )

		const fileNames = await getFilteredFileNames( {
			path       : dir,
			extensions : [ '.yml' ],
		} )

		if ( !fileNames.length ) {

			console.warn( `No local workflows found in ${dir}` )
			return

		}
		const data = {
			file   : 'file',
			inputs : 'inputs',
		}

		const cache = await initCache( {
			projectName : repoID || 'dovenv',
			id          : 'workflow',
			values      : {
				[data.file]   : fileNames[0],
				[data.inputs] : workflowDefaultInputs || '',
			},
		} )

		await promptLine( {
			outro    : repoURL ? `✨ See action progress: ${joinUrl( repoURL, 'actions' )}` : 'Succesfully finished 🌈',
			onCancel : p => {

				p.cancel( 'Canceled 💔' )
				process.exit( 0 )

			},
			list : async p => ( {
				desc        : () => p.log.info( this.color.gray.dim( 'Prompt for run workflow' ) ),
				[data.file] : async () =>  p.select( {
					message : 'Select a workflow:',
					options : fileNames.map( value => ( {
						value,
						label : value,
					} ) ),
					initialValue : cache.get( data.file ),
				} ),
				[data.inputs] : async () => p.text( {
					initialValue : cache.get( data.inputs ) as string,
					message      : `Set inputs for workflow in comma separed. Set empty to not use any inputs.`,
				} ),
				fn : async ( { results } ) => {

					const answers = results as unknown as Record< string, string >

					let formattedInputs = ''
					if ( answers.inputs && answers.inputs.trim() !== '' ) {

						try {

							const inputsArray = answers.inputs.split( ',' ).map( input => input.trim() )
							formattedInputs   = inputsArray
								.map( input => {

									const [ key, value ] = input.split( '=' )
									return `-f ${key}=${value}`

								} )
								.join( ' ' )

						}
						catch ( _e ) {

							formattedInputs = ''

						}

					}

					const createdWorkflow = await execChild( `gh workflow run ${answers.file}.yml ${formattedInputs}` )
					if ( createdWorkflow.stderr ) throw Error( 'Error creating workflow' )

					const result = await execChild( 'echo $(gh run list --limit 1 --json databaseId,url --jq \'.[0].url\')' )
					if ( result.stdout && result.stdout.trim() !== '' ) p.log.info( `GitHub action url: ${result.stdout}` )

					cache.set( answers )

				},
			} ),
		} )

	}

}
