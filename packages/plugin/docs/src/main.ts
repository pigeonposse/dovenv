
import type { DocsConfig } from './config/types'

export { config } from './plugin'
export { Docs } from './run'
export type { DocsConfig }

/**
 * Defines a configuration object for the documentation plugin.
 * @param {DocsConfig} conf - The configuration object.
 * @returns {DocsConfig} The defined configuration object.
 */
export const defineConfig = ( conf: DocsConfig ) => conf
