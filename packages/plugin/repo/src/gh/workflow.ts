import {
	execChild,
	getFilteredFileNames,
	process,
	joinUrl,
	getPaths,
	getDirTree,
	box,
	existsDir,
	relativePath,
} from '@dovenv/core/utils'

import { Repo } from '../_super/main'

export class Workflow extends Repo {

	async list() {

		const {
			workflowsDir, repoURL,
		} = this.opts || {}

		// this is typed as undefined too, but it is not. workflowsDir is a string set in the constructor
		if ( !workflowsDir ) return console.warn( `No workflows dir provided. You need to provide a workflows dir` )

		console.debug( { workflowsDir } )
		const fileNames = await getPaths( [ workflowsDir + '/*.yml' ], { onlyFiles: true  } )
		const color     = this.style.color
		let content     = ( fileNames && fileNames.length )
			? await getDirTree( {
				name  : '.github/workflows\n',
				input : workflowsDir,
			} )
			: color.cyan( `No workflows found it!` )

		content  += '\n' + ( color.cyan( `PATH: ` ) + this.style.get.text( relativePath( process.cwd(), workflowsDir ) ) )
		content  += ( repoURL )  ? '\n' + color.cyan( `URL: ` ) + this.style.get.text( this.style.get.link( repoURL ) ) : ''
		const res = box( content, {
			padding     : 1,
			dimBorder   : true,
			borderColor : 'gray',
			borderStyle : 'none',
		} )
		console.log( res )

	}

	async run() {

		await this.init()
		await this.initGH()

		const {
			workflowDefaultInputs, workflowsDir, repoURL,
		} = this.opts || {}
		const dir   = workflowsDir as string
		const exist = await existsDir( dir )
		if ( !exist ) {

			console.warn( `Does not exist workflows directory: ${dir}` )
			return

		}
		const fileNames = await getFilteredFileNames( {
			path       : dir,
			extensions : [ '.yml' ],
		} )

		if ( !fileNames.length ) {

			console.warn( `No local workflows found in ${dir}` )
			return

		}
		const data        = {
			file   : 'file',
			inputs : 'inputs',
		} as const
		const defaultData = {
			[data.file]   : fileNames[0],
			[data.inputs] : workflowDefaultInputs || '',
		}
		const cache       = await this.cache( 'workflow', defaultData )
		const cached      = await cache.get()

		await this.promptGroup( {
			outro    : this.style.get.succed( repoURL ? `See action progress: ${this.style.get.link( joinUrl( repoURL, 'actions' ) )}` : 'Succesfully finished 🌈' ),
			onCancel : this.onCancel,
			list     : async p => ( {
				desc        : () => p.log.info( this.style.get.text( 'Prompt for run workflow' ) ),
				[data.file] : async () =>  p.select( {
					message : 'Select a workflow:',
					options : fileNames.map( value => ( {
						value,
						label : value,
					} ) ),
					initialValue : cached[data.file],
				} ),
				[data.inputs] : async () => p.text( {
					initialValue : cached[data.inputs],
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
					cache.set( answers )
					const createdWorkflow = await execChild( `gh workflow run ${answers.file}.yml ${formattedInputs}` )
					if ( createdWorkflow.stderr ) throw Error( 'Error creating workflow' )

					const result = await execChild( 'echo $(gh run list --limit 1 --json databaseId,url --jq \'.[0].url\')' )
					if ( result.stdout && result.stdout.trim() !== '' ) p.log.info( `GitHub action url: ${result.stdout}` )

				},
			} ),
		} )

	}

}
