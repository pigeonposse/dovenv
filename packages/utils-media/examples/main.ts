// nothing
import * as dist from '../dist/main.mjs'

Object.keys( dist ).forEach( d => console.log( d ) )
// console.dir( { functions: Object.keys( dist ) }, { depth: Infinity } )
