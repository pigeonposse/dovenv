import type {
	Any,
	AnyArray,
	NonUndefined,
	Prettify,
} from './super'

/**
 * DeepRequired.
 *
 * @description Required that works for deeply nested structure.
 * @example
 *   type NestedProps = {
 *     first?: {
 *       second?: {
 *         name?: string;
 *       };
 *     };
 *   };
 *   type RequiredNestedProps = DeepRequired<NestedProps>
 *   // Expect: {
 *   //   first: {
 *   //     second: {
 *   //       name: string;
 *   //     };
 *   //   };
 *   // }
 */
export type DeepRequired<T> = Prettify<_DeepRequired<T>>
type _DeepRequired<T> = T extends ( ...args: AnyArray ) => Any
	? T
	: T extends AnyArray
		? Prettify<_DeepRequiredArray<T[number]>>
		: T extends object
			? Prettify<_DeepRequiredObject<T>>
			: T

type _DeepRequiredArray<T> = Array<_DeepRequired<NonUndefined<T>>>

type _DeepRequiredObject<T> = {
	[P in keyof T]-?: _DeepRequired<NonUndefined<T[P]>>;
}

