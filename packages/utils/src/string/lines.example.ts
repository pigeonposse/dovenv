import { removeEmptyLines } from './lines'

const exampleText = `

Line 1
    
Line 2


Line 3


`

console.log( '--- Original Text ---' )
console.log( exampleText )

// --- Scenario 1: Default (no consecutive empty lines, no leading/trailing) ---
console.log( '--- Default (maxConsecutive: 0) ---' )
console.log( removeEmptyLines( exampleText ) )

// --- Scenario 2: Allow one consecutive empty line ---
console.log( '--- Options: { maxConsecutive: 1 } ---' )
console.log( removeEmptyLines( exampleText, { maxConsecutive: 1 } ) )

// --- Scenario 2: Allow one consecutive empty line ---
console.log( '--- Options: { maxConsecutive: 1, trimStart: true, trimEnd: true } ---' )
console.log( removeEmptyLines( exampleText, {
	maxConsecutive : 1,
	trimStart      : true,
	trimEnd        : true,
} ) )

// --- Scenario 4: Allow 2 consecutive, but remove leading/trailing ---
const textWithManyLeadingTrailing = `
    
    
Hello
World


Goodbye

`
console.log( '--- Options: { maxConsecutive: 2 } (New Text) ---' )
console.log( removeEmptyLines( textWithManyLeadingTrailing, { maxConsecutive: 2 } ) )
