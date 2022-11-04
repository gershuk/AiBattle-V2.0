export interface Spawn {
	x: number
	y: number
}

export interface TopLeft {
	x: number
	y: number
}

export interface BottomRight {
	x: number
	y: number
}

export interface Basis {
	topLeft: TopLeft
	bottomRight: BottomRight
}

export interface MapData {
	width: number
	height: number
	map: string[][]
	startSnowMap: number | number[][]
	snowIncreasePeriod: number
	snowIncreaseValue: number | number[][]
	lastSnowIncreaseStep: number
	spawns: Spawn[]
	bases: Basis[]
	turns: number
}
