import {
	execChild,
	getFilteredFileNames,
	joinUrl,
	getPaths,
	getDirTree,
	box,
	existsDir,
	relativePath,
} from '@dovenv/core/utils'

import { GHSuper } from './_super'

export class GitHubWorkflow extends GHSuper {

	async list() {

		const {
			workflowsDir, URL:repoURL,
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

		content  += '\n' + ( color.cyan( `PATH: ` ) + this.style.p( relativePath( this.process.cwd(), workflowsDir ) ) )
		content  += ( repoURL )  ? '\n' + color.cyan( `URL: ` ) + this.style.p( this.style.a( repoURL ) ) : ''
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
			workflowDefaultInputs, workflowsDir, URL: repoURL,
		} = this.opts || {}

		const exist = workflowsDir ? await existsDir( workflowsDir ) : false
		if ( !exist || !workflowsDir ) {

			this.prompt.log.warn( this.style.warn.msg( `Does not exist workflows directory:`, workflowsDir ) )
			return

		}
		const fileNames = await getFilteredFileNames( {
			path       : workflowsDir,
			extensions : [ '.yml' ],
		} )

		if ( !fileNames.length ) {

			this.prompt.log.warn( this.style.warn.msg( `No local workflows found in`, workflowsDir ) )
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
			onCancel : this.onCancel,
			list     : async p => ( {
				desc        : () => p.log.info( this.style.p( 'Prompt for run workflow' ) ),
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
					message      : `Set inputs for workflow in comma separed. ${this.style.color.dim( '(Leave empty to not use any input)' )}`,
				} ),
				fn : async ( { results } ) => {

					try {

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

						if ( result.stdout && result.stdout.trim() !== '' )
							p.log.info( `GitHub action url: ` + this.style.p( result.stdout ) )

						p.log.success( repoURL
							? this.style.success.msg( `See action progress:`, this.style.a( joinUrl( repoURL, 'actions' ) ) )
							:  this.style.success.msg( 'Succesfully finished 🌈' ),
						)

					}
					catch ( e ) {

						if ( e instanceof Error ) p.log.error( this.style.error.msg( e.message ) )
						else console.error( e )

					}

				},
			} ),
		} )

	}

}
