import { Response } from '../../_shared/types'

export type ConstValue = string | number | boolean | Record<string, unknown>

export type ConstConfig = Record<string, ConstValue | ( () => Response<ConstValue> )>
