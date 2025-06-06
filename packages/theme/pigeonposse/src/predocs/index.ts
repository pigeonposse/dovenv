import { TYPE }                from './const'
import { partialConstructor }  from './data/partials'
import { templateConstructor } from './data/templates'
import { EMOJI }               from './emoji'

export {
	predocsPlugin,
	Predocs,
} from './build'
export {
	TYPE,
	EMOJI,
}
export { getSidebar } from './sidebar'

export const template = templateConstructor( EMOJI )
export const partial = partialConstructor( EMOJI )

export type * from './types'
