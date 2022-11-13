import {
	attach,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector'
import { MapData } from './type'
// import SIMPLE_MAP from './assets/simple_map.json'
// import FOREST from './assets/forest.json'
// import SHORT_MAZE from './assets/short_maze.json'
// import KING_OF_THE_HILL from './assets/king_of_the_hill.json'
import { jsonIsValid } from 'libs'

const $maps = createStore<{ content: string; name: string }[]>([
	// { content: JSON.stringify(SIMPLE_MAP), name: 'simple_map.json' },
	// { content: JSON.stringify(FOREST), name: 'forest.json' },
	// { content: JSON.stringify(SHORT_MAZE), name: 'short_maze.json' },
	// { content: JSON.stringify(KING_OF_THE_HILL), name: 'king_of_the_hill.json' },
])

const $dataMaps = $maps.map(maps =>
	maps.reduce<{
		[name: string]: {
			data: MapData | null
			validJson: boolean
			name: string
			content: string
		}
	}>((acc, { content, name }) => {
		const validJson = jsonIsValid(content)
		return {
			...acc,
			[name]: {
				validJson,
				data: validJson ? JSON.parse(content) : null,
				name,
				content,
			},
		}
	}, {})
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

readMapsFromLocalStorageFx()

export { $maps, $dataMaps, addMap, removeMap, changeMap }
