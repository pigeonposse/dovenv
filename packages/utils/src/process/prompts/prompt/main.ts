
import Enquirer from 'enquirer'

import type { PromptParams } from './types'

/**
 * Ask questions to user with prompt function.
 * @param   {PromptParams} props - PromptOptions.
 * @returns {Promise<*>}         - Promise resolving to answers.
 * @see https://clippo.pigeonposse.com
 * @example
 *
 * const answers = await prompt([
 *   {
 *     type: 'toggle',
 *     name: 'ready',
 *     message: 'Are you ready?',
 *     enabled: 'Yep',
 *     disabled: 'Nope',
 *   },
 *   {
 *     type: 'number',
 *     name: 'age',
 *     message: 'What is your age',
 *   },
 * ]);
 * console.log(answers.ready, answers.age)
 */
export async function prompt( props: PromptParams ) {

	return Enquirer.prompt( props )

}
