import { getMD } from '../md'
import {
	getCurrentDir,
	joinPath,
} from '../sys'
import { highlight } from './color'

const currDir       = await getCurrentDir( import.meta.url )
const pkgDir        = joinPath( currDir, '..', '..' )
const readmePath    = joinPath( pkgDir, 'README.md' )
const readmeContent = await getMD( readmePath )
const CONTENT       = highlight( readmeContent, {
	language       : 'md',
	ignoreIllegals : true,

} )
console.log( CONTENT )
