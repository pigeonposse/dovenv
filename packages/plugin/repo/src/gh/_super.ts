import { execChild } from '@dovenv/core/utils'

import { Repo } from '../_super/main'

type Repository = {
	url   : string
	name  : string
	owner: {
		id    : string
		login : string
	}
	description?      : string
	homepageUrl?      : string
	repositoryTopics? : { name: string }[]
}

export class GHSuper extends Repo {

	async getRepoList( opts?: {
		archived?   : boolean
		fork?       : boolean
		visibility? : 'public' | 'private' | 'internal'
	} ) {

		const {
			archived,
			fork,
			visibility,
		} = opts || {}
		const flags: string[] = []

		await this.init()
		await this.initGH()

		if ( archived === true ) flags.push( '--archived' )
		else if ( archived === false ) flags.push( '--no-archived' )

		if ( fork === true ) flags.push( '--fork' )
		else if ( fork === false ) flags.push( '--source' )

		if ( visibility ) flags.push( `--visibility ${visibility}` )
		const command = `gh repo list ${this.opts?.userID || ''} --json url,name,owner,homepageUrl,description,repositoryTopics`
		const {
			stdout, stderr,
		} = await execChild( flags.length ? `${command} ${flags.join( ' ' )}` : command )
		if ( stderr ) throw new Error( `Error getting repo list: ${stderr}` )
		const repos = JSON.parse( stdout.trim() ) as Repository[]

		return repos.map( r => ( {
			desc     : r.description?.trim() === '' ? undefined : r.description,
			homepage : r.homepageUrl?.trim() === '' ? undefined : r.homepageUrl,
			name     : r.name,
			owner    : r.owner.login,
			topics   : r.repositoryTopics?.map( t => t.name ),
			url      : r.url,
		} ) )

	}

}
