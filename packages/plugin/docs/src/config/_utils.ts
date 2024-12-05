import { deepmergeCustom } from '@dovenv/core/utils'

import type { DocsConfig } from './types'

export const mergeConfig = deepmergeCustom<DocsConfig>( {} )
