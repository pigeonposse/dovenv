/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Any Array type
 * Same as `any[]` type. Used only for prevent ts errors
 */
export type AnyArray = any[]
/**
 * Any type
 * Same as `any` type. Used only for prevent ts errors
 */

export type Any = any

/**
 * Values of Object
 */
export type ObjectValues<Values> = Values[keyof Values]

/**
 * Keys of Object
 */
export type ObjectKeys<Values> = keyof Values

/**
 * Prettify your type for better readability
 */
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {}

/**
 * NonUndefined
 * @description Exclude undefined from set `A`
 * @example
 *   // Expect: "string | null"
 *   SymmetricDifference<string | null | undefined>;
 */
export type NonUndefined<A> = A extends undefined ? never : A

/**
 * FunctionKeys
 * @description Get union type of keys that are functions in object type `T`
 * @example
 *  type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};
 *
 *   // Expect: "setName | someFn"
 *   type Keys = FunctionKeys<MixedProps>;
 */
export type FunctionKeys<T extends object> = {
	[K in keyof T]-?: NonUndefined<T[K]> extends Function ? K : never;
}[keyof T]

/**
 * NonFunctionKeys
 * @description Get union type of keys that are non-functions in object type `T`
 * @example
 *   type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};
 *
 *   // Expect: "name | someKey"
 *   type Keys = NonFunctionKeys<MixedProps>;
 */
export type NonFunctionKeys<T extends object> = {
	[K in keyof T]-?: NonUndefined<T[K]> extends Function ? never : K;
}[keyof T]

/**
 * AssertEqual
 * @description Checks if two types `T` and `U` are equal.
 * @example
 *   type Test = AssertEqual<string, string>; // Expected: true
 *   type TestFail = AssertEqual<string, number>; // Expected: false
 */
export type AssertEqual<T, U> = ( <V>() => V extends T ? 1 : 2 ) extends ( <V>() => V extends U ? 1 : 2 ) ? true : false

/**
 * ExpectEqual
 * @description Returns the type `T` if `T` and `U` are equal; otherwise, returns `never`.
 * @example
 *   type Test = ExpectEqual<string, string>; // Expected: string
 *   type TestFail = ExpectEqual<string, number>; // Expected: never
 */
export type ExpectEqual<T, U> = AssertEqual<T, U> extends true ? T : never
