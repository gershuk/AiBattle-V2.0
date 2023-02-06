export interface Spawn {
	x: number
	y: number
}

/** @see {isMapData} ts-auto-guard:type-guard */
export interface MapData {
	map: number[][]
	spawns: Spawn[]
}
