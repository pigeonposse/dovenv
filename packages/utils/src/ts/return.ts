import type { Any } from './super'

export type ReturnAwaitedType<T extends ( ...args: Any ) => Any> = Awaited<ReturnType<T>>
