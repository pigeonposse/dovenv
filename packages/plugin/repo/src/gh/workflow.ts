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
		const fileNames = await getPaths( [ workflowsDir + '/*.yml' ], { onlyFiles: true } )
		const color     = this.utils.style.color
		let content     = ( fileNames && fileNames.length )
			? await getDirTree( {
				name  : '.github/workflows\n',
				input : workflowsDir,
			} )
			: color.cyan( `No workflows found it!` )

		content  += '\n' + ( color.cyan( `PATH: ` ) + this.utils.style.p( relativePath( this.utils.process.cwd(), workflowsDir ) ) )
		content  += ( repoURL ) ? '\n' + color.cyan( `URL: ` ) + this.utils.style.p( this.utils.style.a( repoURL ) ) : ''
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

			this.utils.prompt.log.warn( this.utils.style.warn.msg( `Does not exist workflows directory:`, workflowsDir ) )
			return

		}
		const fileNames = await getFilteredFileNames( {
			path       : workflowsDir,
			extensions : [ '.yml' ],
		} )

		if ( !fileNames.length ) {

			this.utils.prompt.log.warn( this.utils.style.warn.msg( `No local workflows found in`, workflowsDir ) )
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
		const cache       = await this.utils.cache( 'workflow', defaultData )
		const cached      = await cache.get()

		await this.utils.promptGroup( {
			onCancel : this.utils.onCancel,
			list     : async p => ( {
				desc        : () => p.log.info( this.utils.style.p( 'Prompt for run workflow' ) ),
				[data.file] : async () => p.select( {
					message : 'Select a workflow:',
					options : fileNames.map( value => ( {
						value,
						label : value,
					} ) ),
					initialValue : cached[data.file],
				} ),
				[data.inputs] : async () => p.text( {
					initialValue : cached[data.inputs],
					message      : `Set inputs for workflow in comma separed. ${this.utils.style.color.dim( '(Leave empty to not use any input)' )}`,
				} ),
				fn : async ( { results } ) => {

					try {

						const answers = results as unknown as Partial<typeof defaultData>

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

						await cache.set( {
							[data.file]   : answers.file,
							[data.inputs] : answers.inputs || '',
						} )
						const createdWorkflow = await execChild( `gh workflow run ${answers.file}.yml ${formattedInputs}` )
						if ( createdWorkflow.stderr ) throw Error( 'Error creating workflow' )

						const result = await execChild( 'echo $(gh run list --limit 1 --json databaseId,url --jq \'.[0].url\')' )

						if ( result.stdout && result.stdout.trim() !== '' )
							p.log.info( `GitHub action url: ` + this.utils.style.p( result.stdout ) )

						p.log.success( repoURL
							? this.utils.style.success.msg( `See action progress:`, this.utils.style.a( joinUrl( repoURL, 'actions' ) ) )
							: this.utils.style.success.msg( 'Succesfully finished 🌈' ),
						)

					}
					catch ( e ) {

						const msg = e instanceof Error
							? e.message
							: e && typeof e === 'object' && 'stderr' in e
								? `${e.stderr}`
								: typeof e === 'object'
									? JSON.stringify( e )
									: `${e}`

						p.log.error( this.utils.style.error.msg( 'Workflow error\n', msg ) )

					}

				},
			} ),
		} )

	}

}
