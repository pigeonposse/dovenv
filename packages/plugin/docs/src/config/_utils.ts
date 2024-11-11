import { deepmergeCustom } from '@dovenv/utils'

import type { DocsConfig } from './types'

export const mergeConfig = deepmergeCustom<DocsConfig>( {} )
