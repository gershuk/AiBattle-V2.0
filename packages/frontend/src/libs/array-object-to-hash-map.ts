export const arrayObjectToHasMap = <T extends { [k: string | number]: any }, K extends keyof T, U = T>(
	arrayObj: T[],
	keyField: K,
	map?: (item: T) => U
) => {
	const _map = map ? map : (item: T) => item
	return arrayObj.reduce(
		(acc, item) => ({ ...acc, [item[keyField]]: _map(item) }),
		{} as { [key: string]: U }
	)
}
