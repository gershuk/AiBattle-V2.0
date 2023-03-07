interface ErrorBase {
	guard: (error: Error) => boolean
}

interface DisplayedError extends ErrorBase {
	msg: string | (() => string)
}

interface IgnoreError extends ErrorBase {
	ignore: true
}

export type ErrorItem = DisplayedError | IgnoreError

export const isDisplayedError = (item: any): item is DisplayedError =>
	!!item?.msg
export const isIgnoreError = (item: any): item is DisplayedError =>
	!!item?.ignore
