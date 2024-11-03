import { performance as perf } from 'node:perf_hooks'
import prettyMilliseconds      from 'pretty-ms'

export const performance = () => {

	const start   = perf.now()
	const stopNum = () => ( perf.now() - start ) / 1000
	return {
		stop       : () => stopNum().toFixed( 2 ),
		prettyStop : () => prettyMilliseconds( stopNum() ),
	}

}

/**
 * Gets the current date and time as an object containing separate fields for year, month, day, hours, minutes, and seconds.
 * @returns {{ year: string; month: string; day: string; hours: string; minutes: string; seconds: string }} - An object representing the current date and time.
 */
export const getCurrentDateTime = (): {
	year    : string
	month   : string
	day     : string
	hours   : string
	minutes : string
	seconds : string
} => {

	const currentDate = new Date()
	const year        = currentDate.getUTCFullYear().toString()
	const month       = ( '0' + ( currentDate.getUTCMonth() + 1 ) ).slice( -2 )
	const day         = ( '0' + currentDate.getUTCDate() ).slice( -2 )
	const hours       = ( '0' + currentDate.getUTCHours() ).slice( -2 )
	const minutes     = ( '0' + currentDate.getUTCMinutes() ).slice( -2 )
	const seconds     = ( '0' + currentDate.getUTCSeconds() ).slice( -2 )

	return {
		year,
		month,
		day,
		hours,
		minutes,
		seconds,
	}

}

/**
 * Gets the current date and time in ISO 8601 format as a string.
 * @returns {string} - The current date and time as an ISO 8601 string.
 */
export const getCurrentDateTimeString = (): string => {

	const time = getCurrentDateTime()

	return `${time.year}-${time.month}-${time.day}T${time.hours}:${time.minutes}:${time.seconds}Z`

}
