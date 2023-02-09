type HtmlInputs = HTMLInputElement | HTMLSelectElement

interface InputField {
	tagName: 'INPUT'
	type: string
	srtValue: string
	name: string
	htmlField: HTMLInputElement
}

interface SelectField {
	tagName: 'SELECT'
	srtValue: string
	name: string
	htmlField: HTMLSelectElement
}

type Field = InputField | SelectField

export const dotToJson = (keys: string, value: any) => {
	const tempObject: { [k: string]: any } = {}
	let container = tempObject
	keys.split('.').map((k, i, values) => {
		container = container[k] = i == values.length - 1 ? value : {}
	})
	return tempObject
}

const isObject = (item: any): item is { [k: string]: any } => {
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

const regexpIsArray = /^(\w+)[[]\d+[\]]/
const buildArray = (jsonData: { [k: string]: any }): { [k: string]: any } => {
	return Object.entries(jsonData).reduce((acc, [key, value]) => {
		regexpIsArray.lastIndex = 0
		if (regexpIsArray.test(key)) {
			const itemName = regexpIsArray.exec(key)?.[1]!
			const index = Number(key.replace(itemName, '').replace(/[\[\]']+/g, ''))
			const valueFields = [...(acc?.[itemName] || [])]
			valueFields[index] = isObject(value) ? buildArray(value) : value
			return { ...acc, [itemName]: valueFields }
		}
		const newValue = isObject(value) ? buildArray(value) : value
		return {
			...acc,
			[key]: newValue,
		}
	}, {} as { [k: string]: any })
}

export const htmlFormToJson = <T extends { [k: string]: any }>(
	htmlForm: HTMLFormElement,
	config?: {
		mapValues?: (field: Field) => any | undefined
	}
) => {
	const { mapValues } = config || {}

	const elements = Array.from(htmlForm.elements) as HtmlInputs[]
	const fields = [] as Field[]
	elements.forEach(element => {
		if (element?.name) {
			const tagName = element.tagName
			switch (tagName) {
				case 'INPUT': {
					const type = element?.type?.toLocaleLowerCase?.() ?? 'text'
					const srtValue = element.value
					fields.push({
						htmlField: element as HTMLInputElement,
						type,
						srtValue,
						tagName,
						name: element.name,
					})
					break
				}

				case 'SELECT': {
					const srtValue = element.value
					fields.push({
						htmlField: element as HTMLSelectElement,
						srtValue,
						tagName,
						name: element.name,
					})
					break
				}
			}
		}
	})

	const values = fields.reduce((acc, field) => {
		let value: any = field.srtValue
		if (mapValues) {
			const resultMapValue = mapValues(field)
			if (resultMapValue !== undefined) {
				return {
					...acc,
					[field.name]: resultMapValue,
				}
			}
		}

		if (field.tagName === 'INPUT') {
			if (field.type === 'text') value = field.srtValue
			if (field.type === 'number')
				value = field.srtValue.trim() === '' ? null : Number(field.srtValue)
		}

		if (field.tagName === 'SELECT') {
			value = field.srtValue.trim() === '' ? null : field.srtValue
		}

		return {
			...acc,
			[field.name]: value,
		}
	}, {} as { [k: string]: any })

	const jsonData = Object.entries(values).map(([key, value]) =>
		dotToJson(key, value)
	)

	const mergeData = mergeDeep({}, ...jsonData)
	const dataWithArrays = buildArray(mergeData)

	return dataWithArrays as T
}
