export const isObject = (item: any): item is { [k: string]: any } => {
	return item && typeof item === 'object' && !Array.isArray(item)
}
