export const make2dArray = <T = any>(rows: number, columns: number, val: T) => {
	let arr: T[][] = []
	for (let i = 0; i < columns; i++) {
		arr[i] = []
		for (let j = 0; j < rows; j++) {
			arr[i][j] = val
		}
	}
	return arr
}
