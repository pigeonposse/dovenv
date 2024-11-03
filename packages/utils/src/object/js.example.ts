import { getObjectFromJSContent } from './js'

const code = `
export default {
	a : 1,
	b : 2,
}
export const fn = () => {}
`
const res = await getObjectFromJSContent( code )
console.log( res )
