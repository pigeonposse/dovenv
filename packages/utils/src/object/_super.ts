import {
	readFile,
	validateHomeDir,
} from '../sys/super/main'

export type CommonObj =
	Record<string, unknown>
	| Record<string, unknown>[]
	| unknown[]

export const getFileContent = async ( path:string ) => {

	path                    = validateHomeDir( path )
	const fileContentBuffer = await readFile( path )
	const fileContent       = fileContentBuffer.toString( 'utf8' )
	return fileContent

}
