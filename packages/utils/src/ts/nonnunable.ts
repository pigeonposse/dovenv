import type {
	Any,
	AnyArray,
	Prettify,
} from './super'

/**
 * DeepNonNullable
 * @description NonNullable that works for deeply nested structure
 * @example
 *   type NestedProps = {
 *     first?: null | {
 *       second?: null | {
 *         name?: string | null |
 *         undefined;
 *       };
 *     };
 *   };
 *   type RequiredNestedProps = DeepNonNullable<NestedProps>;
 *   // Expect: {
 *   //   first: {
 *   //     second: {
 *   //       name: string;
 *   //     };
 *   //   };
 *   // }
 */
export type DeepNonNullable<T> = Prettify<_DeepNonNullable<T>>

type _DeepNonNullable<T> = T extends ( ...args: AnyArray ) => Any
	? T
	: T extends AnyArray
		? Prettify<Array<_DeepNonNullable<NonNullable<T[number]>>>>
		: T extends object
			? Prettify<{
				[P in keyof T]-?: _DeepNonNullable<NonNullable<T[P]>>;
			}>
			: Prettify<NonNullable<T>>

