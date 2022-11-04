import { createEvent, createStore } from 'effector'
import { MapData } from './type'
import SIMPLE_MAP from './assets/simple_map.json'
import FOREST from './assets/forest.json'
import SHORT_MAZE from './assets/short_maze.json'
import KING_OF_THE_HILL from './assets/king_of_the_hill.json'

const $maps = createStore<{ data: MapData; name: string }[]>([
	{ data: SIMPLE_MAP, name: 'simple_map.json' },
	{ data: FOREST, name: 'forest.json' },
	{ data: SHORT_MAZE, name: 'short_maze.json' },
	{ data: KING_OF_THE_HILL, name: 'king_of_the_hill.json' },
])

const addMap = createEvent<{ data: MapData; name: string }>()
const removeMap = createEvent<string>()

$maps.on(addMap, (maps, newMap) => [...maps, newMap])
$maps.on(removeMap, (maps, mapName) =>
	maps.filter(({ name }) => name !== mapName)
)

export { $maps, addMap, removeMap }
