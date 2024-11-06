
/** @type {import('unbuild').BuildConfig} */
export const config = {
	sourcemap   : false,
	declaration : true,
	rollup      : { esbuild : {
		minify : false,
		target : 'node20',
	} },
	failOnWarn : true,
}
