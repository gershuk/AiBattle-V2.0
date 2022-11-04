import { combine, createEvent, createStore } from 'effector'
import { $maps } from 'model'

const $selectedNameMap = createStore<string | null>(null)

const $selectedMap = combine(
	$maps,
	$selectedNameMap,
	(maps, nameMap) => maps.find(({ name }) => name === nameMap) ?? null
)

const selected = createEvent<string | null>()

$selectedNameMap.on(selected, (_, name) => name)

export { $selectedNameMap, $selectedMap, selected }
