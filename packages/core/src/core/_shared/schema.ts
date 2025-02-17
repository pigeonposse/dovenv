import { ValidateAnyType } from '@dovenv/utils'

import { Command } from './main'

export const responseSchema = <T extends ValidateAnyType>( t: T, v: Command['utils']['validate'] ) =>
	v.union( [ v.promise( t ), t ] )
