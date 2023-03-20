import {
	attach,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector'
import { MapData } from './type'
import { arrayObjectToHasMap, stringToJson } from 'libs'
import { isMapData } from './type.guard'

const $maps = createStore<{ content: string; name: string }[]>([])

const $dataMaps = $maps.map(maps =>
	arrayObjectToHasMap(maps, 'name', ({ content, name }) => {
		const { status: validJson, parsedJson: jsonParseResult } =
			stringToJson(content)
		const validDataMap = validJson ? isMapData(jsonParseResult) : false
		return {
			validJson,
			validDataMap,
			valid: validJson && validDataMap,
			data: (validJson && validDataMap
				? jsonParseResult
				: null) as MapData | null,
			name,
			content,
		}
	})
)

const addMap = createEvent<{ content: string; name: string }>()
const removeMap = createEvent<string>()
const changeMap = createEvent<{ content: string; name: string }>()

const addMapsToLocalStorageFx = attach({
	source: $maps,
	effect: maps => {
		localStorage.setItem('maps', JSON.stringify(maps))
	},
})

const readMapsFromLocalStorageFx = createEffect({
	handler: (): { content: string; name: string }[] => {
		return JSON.parse(localStorage.getItem('maps') || '') || []
	},
})

$maps.on(addMap, (maps, newMap) => [...maps, newMap])
$maps.on(removeMap, (maps, mapName) =>
	maps.filter(({ name }) => name !== mapName)
)
$maps.on(changeMap, (maps, mapChanged) =>
	maps.map(map => (map.name === mapChanged.name ? mapChanged : map))
)
$maps.on(readMapsFromLocalStorageFx.doneData, (_, maps) => maps)

sample({
	clock: $maps,
	target: addMapsToLocalStorageFx,
})

export {
	$maps,
	$dataMaps,
	addMap,
	removeMap,
	changeMap,
	readMapsFromLocalStorageFx,
}
