export function Delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
