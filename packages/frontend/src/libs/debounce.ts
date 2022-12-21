export const debounce = <T extends (...args: any) => any>(
	func: T,
	timeout = 300
) => {
	let timer: ReturnType<typeof setTimeout>
	return (...args: Parameters<T>) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}
