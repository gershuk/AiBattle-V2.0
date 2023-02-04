export const deepCopyJson = <T extends { [k: string]: any }>(obj: T) => {
	return JSON.parse(JSON.stringify(obj)) as T
}
