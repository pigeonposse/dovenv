
/**
 * Constant for file patterns.
 */
export const FILES = {
	JS          : '**/*.{js,jsx,cjs,mjs}',
	TS          : '**/*.{ts,tsx,cts,mts}',
	ESM         : '**/*.{mjs,mts}',
	COMMON      : '**/*.{cjs,cts}',
	CSS         : '**/*.css',
	HTML        : '**/*.html',
	JSON        : '**/*.{json,json5,jsonc}',
	PACKAGEJSON : '**/package.json',
	SVELTE      : '**/*.svelte',
	SVELTE_FILE : '**/*.svelte.{js,cjs,mjs,ts,cts,mts}',
	MARKDOWN    : '**/*.md',
	TOML        : '**/*.{toml,tml}',
	YAML        : '**/*.{yaml,yml}',
	VUE         : '**/*.vue',
	TEST_UNIT   : '**/*.{spec,test}.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
	TEST_E2E    : 'tests/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
} as const satisfies Record<string, string>

export const FILES_WITH_JS_OR_TS = [
	FILES.JS,
	FILES.TS,
	FILES.SVELTE,
	FILES.VUE,
	FILES.HTML,
] as const satisfies string[]

