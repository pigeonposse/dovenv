/**
 * Examples for being linted
 */
export type X = {
	add? : string
	b?   : string
}

const foo: ()=> string =   () => 'bar'
const bars: string     = 'foo'
class K {

	opts   : string = 'bar'
	f = 'bar'
	testtt : string = 'dddd'
	optss  : boolean = true

	method(): void {

	}

	method2(): void {

	}

}
console.log( foo, bars, K )
