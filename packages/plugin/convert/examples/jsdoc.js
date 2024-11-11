// utils.mjs

/**
 * Adds two numbers together.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of `a` and `b`.
 * @example
 * // Adds 5 + 3
 * add(5, 3); // 8
 */
export function add( a, b ) {

	return a + b

}

/**
 * Multiplies two numbers together.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The product of `a` and `b`.
 * @example
 * // Multiplies 4 * 2
 * multiply(4, 2); // 8
 */
export function multiply( a, b ) {

	return a * b

}

/**
 * Checks if a number is even.
 * @param {number} num - The number to check.
 * @returns {boolean} `true` if the number is even, otherwise `false`.
 * @example
 * // Check if 4 is even
 * isEven(4); // true
 */
export function isEven( num ) {

	return num % 2 === 0

}

/**
 * Finds the maximum number in an array.
 * @param {number[]} arr - Array of numbers.
 * @returns {number} The maximum number in the array.
 * @throws {Error} If the array is empty.
 * @example
 * // Find the max of [3, 1, 5]
 * max([3, 1, 5]); // 5
 */
export function max( arr ) {

	if ( arr.length === 0 ) throw new Error( 'Array cannot be empty' )
	return Math.max( ...arr )

}
