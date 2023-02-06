export const jsonIsValid = (data: string) => {
	try {
		JSON.parse(data)
		return { status: true, parsedJson: JSON.parse(data) }
	} catch (_) {
		return { status: false }
	}
}
