export const repeatElement = <T>(a: T, b: number) =>
	Array.from({ length: b }, () => a)
