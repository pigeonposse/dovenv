import { toml } from './toml'

const DATA = `
name = "Alice"
age = 30
city = "New York"

[address]
street = "123 Main St"
zip = "10001"

hobbies = ["reading", "hiking", "painting"]
`
const obj    = await toml.deserialize( DATA )
const string = await toml.serialize( obj )

console.log( {
	obj,
	string,
} )
