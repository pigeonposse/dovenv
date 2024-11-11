import type { Any } from './super'

/**
 * UnionToIntersection.
 * @description Get intersection type given union type `U`. Credit: jcalz.
 * @see https://stackoverflow.com/a/50375286/7381355
 * @example
 *   // Expect: { name: string } & { age: number } & { visible: boolean }
 *   UnionToIntersection<{ name: string } | { age: number } | { visible: boolean }>
 */
export type UnionToIntersection<U> = ( U extends Any
	? ( k: U ) => void
	: never ) extends ( k: infer I ) => void
	? I
	: never

/**
 * Type utility to flatten a union type.
 * @template T - The union type to be flattened.
 * @returns The flattened type.
 * @example
 * type UnionType = 'a' | 'b' | 'c'
 * type FlattenedType = FlattenUnion<UnionType> // type FlattenedType = 'a' | 'b' | 'c'
 */
export type FlattenUnion<T> = ( T extends unknown ? ( x: T ) => unknown : never ) extends ( x: infer R ) => unknown ? R : never

