import { Response } from '../../_shared/types'

type ConstValue = string | number | boolean | Record<string, unknown>

export type ConstConfig = Record<string, ConstValue | ( () => Response<ConstValue> )>
