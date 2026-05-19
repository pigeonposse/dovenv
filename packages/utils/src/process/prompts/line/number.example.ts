import { promptLine } from '@dovenv/utils'

const result = await promptLine.number( { message: 'What is your age?' } )

console.log( { result } )

