import { downloadGitHubPath } from './download'

await downloadGitHubPath( {
	input  : 'https://github.com/eilrix/github-directory-downloader/tree/master/src',
	output : './build/gh',
} )
