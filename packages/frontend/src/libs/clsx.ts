function clsx(classes: { [k: string]: boolean }): string
function clsx(...rest: (string | number | null | undefined)[]): string
function clsx(...cls: unknown[]): string {
	if (cls.length === 1 && cls[0] !== null && typeof cls[0] === 'object') {
		return Object.entries(cls[0] as { [k: string]: boolean })
			.filter(([_, show]) => show)
			.map(([cl]) => cl)
			.join(' ')
	}
	return cls
		.filter(x => x !== undefined && x !== null && String(x).trim() !== '')
		.join(' ')
}

export { clsx }
