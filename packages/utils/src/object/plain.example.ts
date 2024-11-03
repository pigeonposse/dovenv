import { getObjectFromPlainContent } from './plain'

const code = `
NUMBER=2
STRING = "hello"
`
const res = await getObjectFromPlainContent( code )
console.log( res )
