import { exec } from '@dovenv/utils'

import { GitSuper } from './super'

export class GitAdd extends GitSuper {

	async ask( initialValue = '.' ) {

		return await this.prompt.text( {
			message      : 'What do you want to add?',
			placeholder  : '.',
			initialValue : initialValue,
		} ) as string

	}

	async exec( value: string ) {

		await exec( `git add ${value}` )

	}

	async run(  ) {

		await this.init()
		const value = await this.ask()
		this.exec( value )

	}

}
