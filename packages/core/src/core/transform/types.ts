import {
	EmptyResponse,
	Response,
} from '../../_shared/types'
import { Command } from '../_shared/main'

export type TransformConfig = {
	[key in string]: {
		/** Description */
		desc? : string
		/** Array of input patterns */
		input : string[]
		/**
		 * Function for transform inputs
		 * @example ({content}) => content.trim() === '' ? 'Default content' : content
		 */
		fn : ( data: {
			/** Paths of the dirs */
			path    : string
			/** Content of the file */
			content : string
			/** Dovenv Configuration */
			utils   : Command['utils']
		} ) => Response<string | EmptyResponse>
	}
}
