import { createEvent, createStore } from 'effector'
import { MapData } from 'model/uploaded-maps/type'

const $selectMap = createStore<{ data: MapData; name: string } | null>(null)
const selectedMap = createEvent<{ data: MapData; name: string } | null>()

$selectMap.on(selectedMap, (_, code) => code)

export { $selectMap, selectedMap }
