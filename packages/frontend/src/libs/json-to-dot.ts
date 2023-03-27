type AnyObject = { [k: string]: any }

export const jsonToDot = (object: AnyObject) => {
	const fn = (
		object: AnyObject | any,
		target: AnyObject = {},
		prefix = '',
		isArray?: boolean
	): AnyObject => {
		if (object !== null && object !== undefined) {
			const keys = Object.keys(object)
			if (keys.length > 0) {
				keys.forEach(key => {
					const keyFormat = isArray ? `[${key}]` : key

					if (Array.isArray(object[key])) {
						fn(object[key], target, prefix + keyFormat, true)
					} else if (
						typeof object[key] === 'object' &&
						typeof object[key] !== null
					) {
						fn(object[key], target, prefix + keyFormat + '.')
					} else {
						target[prefix + keyFormat] = object[key]
					}
				})
			}
		} else {
			if (Object.keys(target).length > 0 && prefix !== '') {
				target[prefix.substring(0, prefix.length - 1)] = object
			} else {
				return target
			}
		}
		return target
	}

	return fn(object, {}, '', Array.isArray(object))
}
