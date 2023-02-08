export const make2dArray = <T = any>(rows: number, columns: number, val: T) => {
	const arr = Array.from({ length: rows }, () =>
		Array.from({ length: columns }, () => val)
	)
	return arr
}