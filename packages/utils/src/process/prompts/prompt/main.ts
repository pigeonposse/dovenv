
import Enquirer from 'enquirer'

import type { PromptParams } from './types'

/**
 * Ask questions to user with prompt function.
 *
 * @param   {PromptParams} props - PromptOptions.
 * @returns {Promise<*>}         - Promise resolving to answers.
 * @see https://www.npmjs.com/package/enquirer
 * @example
 *
 * const answers = await promptGroup([
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
export async function promptGroup( props: PromptParams ) {

	return Enquirer.prompt( props )

}
