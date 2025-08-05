
/** @type {import( '../../src/main' ).Config} */
export default {
	input    : '../../../docs',
	output   : './build/bin',
	twoslash : false,

	vitepress : {
		ignoreDeadLinks : true,
		sitemap         : { hostname: 'https://dovenv.pigeonposse.com' },
	},
}

