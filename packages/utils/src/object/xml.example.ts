import { xml } from './xml'

const DATA = `
<note>
    <to>Tove</to>
    <from>Jani</from>
    <heading>Reminder</heading>
    <body>Don't forget me this weekend!</body>
</note>
`
const obj    = await xml.deserialize( DATA )
const string = await xml.serialize( obj )

console.log( {
	obj,
	string,
} )
