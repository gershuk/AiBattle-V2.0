function PromiseWithTimeout<T>(
	promise: Promise<T>,
	ms: number,
	timeoutError: Error = new Error('Promise timed out')
): Promise<T> {
	const timeout = new Promise<T>((_, reject) => {
		setTimeout(() => {
			reject(timeoutError)
		}, ms)
	})
	return Promise.race([promise, timeout])
}
