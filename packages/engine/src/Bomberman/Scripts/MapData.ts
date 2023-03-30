import { Vector2 } from 'GameEngine/BaseComponents/Vector2'

export class MapData {
	destructibleWallsData: DestructibleWallData[]
	simpleWallsData: WallData[]
	bombsData: BombData[]
	enemiesData: BodyPublicData[]
	playerData: BodyAllData
	map: MapObjectData[][][]

	constructor(
		destructibleWallsData: DestructibleWallData[],
		simpleWallsData: WallData[],
		bombsData: BombData[],
		enemiesData: BodyPublicData[],
		playerData: BodyAllData,
		x: number,
		y: number
	) {
		this.destructibleWallsData = destructibleWallsData
		this.simpleWallsData = simpleWallsData
		this.bombsData = bombsData
		this.enemiesData = enemiesData
		this.playerData = playerData

		this.map = []
		for (let i = 0; i < x; ++i) {
			this.map[i] = []
			for (let j = 0; j < y; ++j) {
				this.map[i][j] = []
			}
		}

		for (let wallData of destructibleWallsData) {
			this.map[wallData.position.x][wallData.position.y].push(wallData)
		}

		for (let simpleWall of simpleWallsData) {
			this.map[simpleWall.position.x][simpleWall.position.y].push(simpleWall)
		}

		for (let bombData of bombsData) {
			this.map[bombData.position.x][bombData.position.y].push(bombData)
		}

		for (let bodyData of enemiesData) {
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

export class WallData extends MapObjectData {
	constructor(position: Vector2, uuid: string) {
		super(position, uuid)
	}
}

export class DestructibleWallData extends WallData {
	health: number

	constructor(position: Vector2, health: number, uuid: string) {
		super(position, uuid)
		this.health = health
	}
}

export class BodyPublicData extends MapObjectData {
	health: number

	constructor(position: Vector2, health: number, uuid: string) {
		super(position, uuid)
		this.position = position
		this.health = health
	}
}

export class BodyAllData extends BodyPublicData {
	bombsMaxCount: number
	bombsCount: number
	bombsRestoreTicks: number
	bombsRestoreCount: number
	lastBombRestoreTurn: number
	controllerUUID: string

	constructor(
		position: Vector2,
		health: number,
		bombsMaxCount: number,
		bombsCount: number,
		bombsRestoreTicks: number,
		bombsRestoreCount: number,
		lastBombRestoreTurn: number,
		uuid: string,
		controllerUUID: string
	) {
		super(position, health, uuid)
		this.health = health
		this.bombsMaxCount = bombsMaxCount
		this.bombsCount = bombsCount
		this.bombsRestoreTicks = bombsRestoreTicks
		this.bombsRestoreCount = bombsRestoreCount
		this.lastBombRestoreTurn = lastBombRestoreTurn
		this.controllerUUID = controllerUUID
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
