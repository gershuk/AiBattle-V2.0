import { createEvent, createStore, sample } from 'effector'
import { changeMap } from 'model'

const $selectMap = createStore<{ content: string; name: string } | null>(null)
const selectedMap = createEvent<{ content: string; name: string } | null>()
const savedMap = createEvent<{ content: string; name: string }>()

$selectMap.on(selectedMap, (_, code) => code)

sample({
	clock: savedMap,
	target: [changeMap, selectedMap],
})

export { $selectMap, selectedMap, savedMap }
