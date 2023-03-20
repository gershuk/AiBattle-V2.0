export const makeMap = (
	rows: number,
	columns: number,
	fillCode: number,
	borderCode = fillCode
) => {
	const map = Array.from({ length: rows }, (_, i) =>
		Array.from({ length: columns }, (__, j) =>
			i === 0 || i === rows - 1 || j === 0 || j === columns - 1
				? borderCode
				: fillCode
		)
	)
	return map
}
