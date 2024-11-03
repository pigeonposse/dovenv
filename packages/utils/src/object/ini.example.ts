import { ini } from './ini'

const iniData = `
name=Alice
age=30
city=New York

[settings]
theme=dark
notifications=true
`

const obj    = await ini.deserialize( iniData )
const string = await ini.serialize( obj )

console.log( obj, '\n', string )
