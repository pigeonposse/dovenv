import { LazyLoader } from '@/sys'

export const _styledeps = new LazyLoader( { figlet: async () => ( await import( 'figlet' ) ).default } )
