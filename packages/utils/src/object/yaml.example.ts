import { yaml } from './yaml'

const DATA = `
name: Alice
age: 30
city: New York
address:
  street: "123 Main St"
  zip: "10001"
hobbies:
  - reading
  - hiking
  - painting
`
const obj    = await yaml.deserialize( DATA )
const string = await yaml.serialize( obj )

console.log( {
	obj,
	string,
} )
