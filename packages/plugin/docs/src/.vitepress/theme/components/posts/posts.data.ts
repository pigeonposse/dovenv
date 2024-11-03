import { createContentLoader } from 'vitepress'

const truncateText =  ( text, length ) => {

	if ( text.length > length ) return text.substring( 0, length ) + '...'
	return text

}

const formatDate = raw => {

	const date = new Date( raw )
	return {
		time   : +date,
		string : date.toDateString(),
	}

}

export default createContentLoader( 'posts/*.md', {
	excerpt : true,
	transform( raw ) {

		return raw
			.map( ( {
				url, frontmatter,
			} ) => ( {
				title    : frontmatter.title,
				url,
				category : frontmatter.category || 'tutorial',
				author   : frontmatter.author,
				excerpt  : truncateText( frontmatter.description, 100 ),
				date     : formatDate( frontmatter.date ),
				image    : frontmatter.image || '/logo.png',
			} ) )
			.sort( ( a, b ) => b.date.time - a.date.time )

	},
} )

