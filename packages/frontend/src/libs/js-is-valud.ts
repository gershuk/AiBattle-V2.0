export const jsIsValid = (str: string) => {
	try {
		eval('function f () {' + str + '}')
		return true
	} catch (_) {
		return false
	}
}
