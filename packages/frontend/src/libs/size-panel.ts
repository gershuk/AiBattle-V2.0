import { createEffect, createEvent, createStore, sample } from 'effector'
import { stringToJson } from './json-is-valid'

export const createPanelSizeController = (
	initialFirstPanelSize: number,
	mode: 'horizontal' | 'vertical',
	localStorageId: string
) => {
	const localStorageKey = `panel-size-${localStorageId}`

	const sizes = (() => {
		try {
			const stringsSizes = localStorage.getItem(localStorageKey)
			if (typeof stringsSizes === 'string') {
				const { parsedJson } = stringToJson<number[]>(stringsSizes)
				if (parsedJson) return parsedJson
			}
		} catch (_) {}
		const sizePage =
			mode === 'horizontal' ? window.innerWidth : window.innerHeight
		const leftPanelWidth = (initialFirstPanelSize / sizePage) * 100
		return [leftPanelWidth, 100 - leftPanelWidth]
	})()

	const $sizes = createStore<number[]>(sizes)
	const setSizes = createEvent<number[]>()

	const saveSizesFx = createEffect((sizes: number[]) => {
		localStorage.setItem(localStorageKey, JSON.stringify(sizes))
	})

	$sizes.on(setSizes, (_, x) => x)

	sample({
		clock: $sizes,
		target: saveSizesFx,
	})

	return { $sizes, setSizes }
}
