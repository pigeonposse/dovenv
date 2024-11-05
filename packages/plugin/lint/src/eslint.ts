import {
	exec,
	process,
} from '@dovenv/utils'

export type EslintConfig = string[]
export const runEslint = async () => {

	const cmd = `eslint ${process.argv.slice( 3 ).join( ' ' )}`

	await exec( cmd )

}
