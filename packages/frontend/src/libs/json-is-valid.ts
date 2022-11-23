export const jsonIsValid = (data: string) => {
	try {
		JSON.parse(data)
		return true
	} catch (_) {
		return false
	}
}
