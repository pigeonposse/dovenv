import type Enquirer from 'enquirer'

export type PromptParams = Parameters<typeof Enquirer.prompt>[0]
