export const stringToJson = <T = any>(data: string) => {
	try {
		const result = { status: true as const, parsedJson: JSON.parse(data) as T }
		return result
	} catch (_) {
		return { status: false as const, parsedJson: null }
	}
}
