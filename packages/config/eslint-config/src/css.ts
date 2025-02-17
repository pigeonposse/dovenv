import * as cssPlugin from 'eslint-plugin-css'

import type { Config } from './_types'

/**
 * YAML Eslint config
 * @see https://github.com/aminya/eslint-plugin-yaml#readme
 */
const config: Config[] = [ cssPlugin.configs['flat/standard'] ]

export default config
