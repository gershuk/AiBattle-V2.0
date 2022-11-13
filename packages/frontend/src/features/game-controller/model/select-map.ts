import { combine, createEvent, createStore } from 'effector'
import { $dataMaps, $maps } from 'model'

const $selectedNameMap = createStore<string | null>(null)

const $selectedMap = combine($dataMaps, $selectedNameMap, (maps, nameMap) =>
	nameMap ? maps[nameMap] ?? null : null
)

const selected = createEvent<string | null>()

$selectedNameMap.on(selected, (_, name) => name)

export { $selectedNameMap, $selectedMap, selected }
