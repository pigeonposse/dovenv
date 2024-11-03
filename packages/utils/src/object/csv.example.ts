import { csv } from './csv'

const csvData = `
name,age,city
Alice,30,New York
Bob,25,Los Angeles
Charlie,35,Chicago
`

const obj    = await csv.deserialize( csvData )
const string = await csv.serialize( obj )
console.log( obj, string )
