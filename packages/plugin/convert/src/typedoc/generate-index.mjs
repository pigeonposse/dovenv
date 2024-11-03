import {
	writeFile,
	joinPath,
	paths, 
} from '@clippo/config/core'

export const getInstallationMDContent = ( { module } ) => {

	const lib   = `@clippo/${module.id}`
	let content = ''

	content += '::: code-group\n\n'

	content += '```bash [npm]\n'
	content += `npm install ${lib}\n`
	content += '```\n\n'

	content += '```bash [pnpm]\n'
	content += `pnpm i ${lib}\n`
	content += '```\n\n'

	content += '```bash [yarn]\n'
	content += `yarn add ${lib}\n`
	content += '```\n\n'

	content += ':::\n\n'
	content += `[![NPM Version](https://img.shields.io/npm/v/${lib}?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/${lib})\n\n`

	return content

}
export const generateIndex = async ( {
	modules, 
	indexPath, 
} ) => {

	let content = '# Clippo Utilities 🛠️\n\n'
	content    += 'Welcome to the utilities documentation. Here you will find links to the documentation for each module.\n'

	modules.forEach( module => {

		const link = joinPath( paths.documentationDir, 'guide', 'utils', module.id, 'index.md' )
		
		content += `\n## ${module.title || module.id}\n\n` // add title
		content += `${module.desc + '\n\n' || ''}` // Add a description or fallback text
		content += getInstallationMDContent( { module } )
		content += `👉 [Read more](${link})\n`

	} )

	await writeFile( indexPath, content )

}
