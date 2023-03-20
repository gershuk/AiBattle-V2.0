import { Effect } from 'effector'
import { ErrorItem, isDisplayedError, isIgnoreError } from './type'

// export interface FailedList<T = any> {
// 	guard: (data: T) => boolean
// 	error: Error
// 	msg?: string
// }

// export const createFailer = <T = any>(failerList: FailedList<T>[]) => {
// 	const checkError = (data: T) => {
// 		const findError = failerList.find(({ guard }) => guard(data))
// 		if (!!findError) throw findError.error
// 		return data
// 	}
// 	const getMessage = (error: Error) => {
// 		const findError = failerList.find(item => item.error === error)
// 		return findError?.msg ?? findError?.error.message
// 	}
// 	return { checkError, getMessage }
// }

export const alertErrors = (config: {
	fxs: Effect<any, any, Error>[]
	errorList: ErrorItem[]
	defaultMessage?: string
	showMessage: (params: { msg: string; errorItem?: ErrorItem }) => void
}) => {
	const { fxs, errorList, defaultMessage, showMessage } = config
	fxs.forEach(fx => {
		fx.failData.watch(error => {
			const findError = errorList.find(({ guard }) => guard(error))
			if (findError) {
				if (isIgnoreError(findError)) return
				else if (isDisplayedError(findError)) {
					const strMsg =
						typeof findError.msg === 'function'
							? findError.msg()
							: findError.msg
					showMessage({
						msg: strMsg,
						errorItem: findError,
					})
				}
			} else if (defaultMessage) {
				showMessage({ msg: defaultMessage })
			}
		})
	})
}
