import playwright from 'eslint-plugin-playwright'

import { FILES } from './const'

import type {
	Config,
	ConfigParamsSuper,
} from './_types'

export type PlaywrightConfigParams = ConfigParamsSuper & { files?: string[] }

/**
 * Generates a Playwright ESLint config based on the given parameters.
 *
 * @param   {PlaywrightConfigParams} [params] - Optional parameters to customize the config.
 * @returns {Config[]}                        - The generated Playwright ESLint config.
 * @see https://www.npmjs.com/package/eslint-plugin-playwright
 * @example
 * // Generates a basic Playwright ESLint config.
 * const config = setPlaywrightConfig()
 *
 * // Generates a Playwright ESLint config with custom rules.
 * const config = setPlaywrightConfig({
 *   rules: {
 *     'playwright/no-focused-tests': 'error',
 *   },
 * })
 */
export const setPlaywrightConfig = ( params: PlaywrightConfigParams = {} ): Config[] => [
	{
		...playwright.configs['flat/recommended'],
		rules : {
			...playwright.configs['flat/recommended'].rules,
			...( params.rules ?? {} ),
		},
		files : params.files ? params.files : [ FILES.TEST_E2E ],
	},
]

/**
 * PLAYWRIGHT ESLINT CONFIG.
 *
 * @see https://www.npmjs.com/package/eslint-plugin-playwright
 */
export const playwrightConfig = setPlaywrightConfig()

