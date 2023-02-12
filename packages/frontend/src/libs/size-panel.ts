import { createEvent, createStore } from 'effector'

export const createPanelSizeController = (
	initialFirstPanelSize: number,
	mode: 'horizontal' | 'vertical' = 'horizontal'
) => {
	const sizePage =
		mode === 'horizontal' ? window.innerWidth : window.innerHeight
	const leftPanelWidth = (initialFirstPanelSize / sizePage) * 100
	const $sizes = createStore<number[]>([leftPanelWidth, 100 - leftPanelWidth])
	const setSizes = createEvent<number[]>()
	$sizes.on(setSizes, (_, x) => x)
	return { $sizes, setSizes }
}
