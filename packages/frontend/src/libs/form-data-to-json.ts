export const dotToJson = (keys: string, value: any) => {
	const tempObject: { [k: string]: any } = {}
	let container = tempObject
	keys.split('.').map((k, i, values) => {
		container = container[k] = i == values.length - 1 ? value : {}
	})
	return tempObject
}

const isObject = (item: any) => {
	return item && typeof item === 'object' && !Array.isArray(item)
}

export const mergeDeep = (
	target: { [k: string]: any },
	...sources: { [k: string]: any }[]
): { [k: string]: any } => {
	if (!sources.length) return target
	const source = sources.shift()

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} })
				mergeDeep(target[key], source[key])
			} else {
				Object.assign(target, { [key]: source[key] })
			}
		}
	}

	return mergeDeep(target, ...sources)
}

export const formDataToJson = <T extends { [k: string]: any }>(
	formData: FormData
) => {
	const obj: { [k: string]: any } = {}
	formData.forEach((v, k) => {
		obj[k] = v
	})
	const jsonData = Object.entries(obj)
		.map(([key, value]) => dotToJson(key, value))
		.reduce((acc, x) => mergeDeep(acc, x), {})
	return jsonData as T
}
