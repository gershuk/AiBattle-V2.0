import { Vector2 } from 'GameEngine/BaseComponents/Vector2'

export class MapData {
	wallsData: WallData[]
	metalsData: MetalData[]
	bombsData: BombData[]
	bodiesData: BodyData[]
	playerData: PlayerData
	map: MapObjectData[][][]

	constructor(
		wallsData: WallData[],
		metalsData: MetalData[],
		bombsData: BombData[],
		bodiesData: BodyData[],
		playerData: PlayerData,
		x: number,
		y: number
	) {
		this.wallsData = wallsData
		this.metalsData = metalsData
		this.bombsData = bombsData
		this.bodiesData = bodiesData
		this.playerData = playerData

		this.map = []
		for (let i = 0; i < x; ++i) {
			this.map[i] = []
			for (let j = 0; j < y; ++j) {
				this.map[i][j] = []
			}
		}

		for (let wallData of wallsData) {
			this.map[wallData.position.x][wallData.position.y].push(wallData)
		}

		for (let metalData of metalsData) {
			this.map[metalData.position.x][metalData.position.y].push(metalData)
		}

		for (let bombData of bombsData) {
			this.map[bombData.position.x][bombData.position.y].push(bombData)
		}

		for (let bodyData of bodiesData) {
			this.map[bodyData.position.x][bodyData.position.y].push(bodyData)
		}

		this.map[playerData.position.x][playerData.position.y].push(playerData)
	}
}

export abstract class MapObjectData {
	position: Vector2
	uuid: string
	constructor(position: Vector2, uuid: string) {
		this.uuid = uuid
		this.position = position
	}
}

export class MetalData extends MapObjectData {
	constructor(position: Vector2, uuid: string) {
		super(position, uuid)
	}
}

export class WallData extends MapObjectData {
	health: number
	constructor(position: Vector2, health: number, uuid: string) {
		super(position, uuid)
		this.health = health
	}
}

export class BodyData extends MapObjectData {
	health: number

	constructor(position: Vector2, health: number, uuid: string) {
		super(position, uuid)
		this.position = position
		this.health = health
	}
}

export class PlayerData extends MapObjectData {
	health: number
	bombsMaxCount: number
	bombsCount: number
	bombsRestoreTicks: number
	bombsRestoreCount: number
	lastBombRestoreTurn: number

	constructor(
		position: Vector2,
		health: number,
		bombsMaxCount: number,
		bombsCount: number,
		bombsRestoreTicks: number,
		bombsRestoreCount: number,
		lastBombRestoreTurn: number,
		uuid: string
	) {
		super(position, uuid)
		this.health = health
		this.bombsMaxCount = bombsMaxCount
		this.bombsCount = bombsCount
		this.bombsRestoreTicks = bombsRestoreTicks
		this.bombsRestoreCount = bombsRestoreCount
		this.lastBombRestoreTurn = lastBombRestoreTurn
	}
}

export class BombData extends MapObjectData {
	turnToExplosion: number
	damage: number
	range: number

	constructor(
		position: Vector2,
		turnToExplosion: number,
		damage: number,
		range: number,
		uuid: string
	) {
		super(position, uuid)
		this.turnToExplosion = turnToExplosion
		this.damage = damage
		this.range = range
	}
}
