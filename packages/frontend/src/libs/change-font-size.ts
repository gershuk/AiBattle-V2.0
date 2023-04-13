import { createEffect, createEvent, createStore, sample } from 'effector'

export const createFontSizeController = (
	initialValue: number,
	localStorageId: string
) => {
	const localStorageKey = `font-size-${localStorageId}`

	const initFontSize = ((): number => {
		try {
			const value = localStorage.getItem(localStorageKey)
			return typeof value === 'string' ? Number(value) : initialValue
		} catch (error) {
			return initialValue
		}
	})()

	const $fontSize = createStore(initFontSize)

	const changedFontSize = createEvent<number>()

	const saveFontSizeFx = createEffect((value: number) => {
		localStorage.setItem(localStorageKey, String(value))
	})

	$fontSize.on(changedFontSize, (_, newFontSize) => newFontSize)

	sample({ clock: $fontSize, target: saveFontSizeFx })

	return {
		$fontSize,
		changedFontSize,
	}
}
