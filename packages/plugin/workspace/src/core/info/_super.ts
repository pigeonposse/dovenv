export type InfoInterface = {
	get : () => Promise<unknown>
	run : () => Promise<void | unknown>
}
