import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { GameObject } from 'GameEngine/GameObject/GameObject'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { HealthComponent } from './Health'
import {
	BodyPublicData,
	BombData,
	MapData,
	WallData,
	BodyAllData,
	DestructibleWallData,
} from './MapData'
import { DestructibleWall } from './DestructibleWall'
import { Wall } from './Wall'
import { BombController } from './BombController'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import {
	BombermanActions,
	BombermanControllerCommand,
	BombermanControllerData,
} from './BombermanController'
import {
	ControllerBody,
	ControllerBodyParameters,
} from 'GameEngine/UserAIRuner/ControllerBody'
import { IAsyncControllerBridge } from 'GameEngine/UserAIRuner/AsyncControllerBridge'
import { BombermanGrid } from './BombermanGrid'

export class ManBody extends ControllerBody<
	BombermanControllerData,
	BombermanControllerData,
	BombermanControllerCommand
> {
	private _bombSpawnFunction: (
		ref: SafeReference<IGameObject>,
		position: Vector2,
		damage: number,
		range: number,
		ticksToExplosion: number
	) => SafeReference<IGameObject>

	private _bombDamage: number
	private _blastRange: number
	private _ticksToExplosion: number

	private _bombsCount: number
	private _bombsMaxCount: number
	private _bombsRestoreTicks: number
	private _bombsRestoreCount: number
	private _lastRestoreTurn: number

	private _healthComponent: SafeReference<HealthComponent>
	private _grid: SafeReference<BombermanGrid>

	Init(gameObject: IGameObject, parameters?: ManBodyParameters): void {
		super.Init(gameObject, parameters)
		if (parameters) {
			this._bombSpawnFunction = parameters.bombSpawnFunction

			this._bombDamage = parameters.bombDamage
			this._blastRange = parameters.blastRange
			this._ticksToExplosion = parameters.ticksToExplosion

			this._bombsCount = parameters.bombsMaxCount
			this._bombsMaxCount = parameters.bombsMaxCount
			this._bombsRestoreTicks = parameters.bombsRestoreTicks
			this._bombsRestoreCount = parameters.bombsRestoreCount
			this._lastRestoreTurn = this.gameObject.scene.turnIndex

			this._grid = parameters.grid
		}
	}

	public GetPublicData(): BodyPublicData {
		return new BodyPublicData(
			this.gameObject.position.Clone(),
			this._healthComponent.object.health,
			this.uuid
		)
	}

	public GetAllData(): BodyAllData {
		return new BodyAllData(
			this.gameObject.position.Clone(),
			this._healthComponent.object.health,
			this._bombsMaxCount,
			this._bombsCount,
			this._bombsRestoreTicks,
			this._bombsRestoreCount,
			this._lastRestoreTurn,
			this.uuid,
			this.controllerBridge.UUID
		)
	}

	OnOwnerInit(): void {
		this._healthComponent = this.gameObject.GetComponents(
			HealthComponent
		)[0] as SafeReference<HealthComponent>
	}

	public GetMapData(): MapData {
		const destructibleWalls: DestructibleWallData[] = []
		const simpleWallsData: WallData[] = []
		const bombsData: BombData[] = []
		const bodiesData: BodyPublicData[] = []
		const playerData = this.GetAllData()
		const refObjects: SafeReference<IGameObject>[] =
			this.gameObject.scene.GetGameObjectsRefByFilter(() => true)

		for (let ref of refObjects) {
			if (ref.object === this.gameObject) continue

			const destructibleWall = (
				ref.object.GetComponents(DestructibleWall)[0]
					?.object as DestructibleWall
			)?.GetData()
			const wall = (
				ref.object.GetComponents(Wall)[0]?.object as Wall
			)?.GetData()
			const bombData = (
				ref.object.GetComponents(BombController)[0]?.object as BombController
			)?.GetData()
			const bodyData = (
				ref.object.GetComponents(ManBody)[0]?.object as ManBody
			)?.GetPublicData()

			if (destructibleWall) destructibleWalls.push(destructibleWall)
			if (wall) simpleWallsData.push(wall)
			if (bombData) bombsData.push(bombData)
			if (bodyData) bodiesData.push(bodyData)
		}
		return new MapData(
			destructibleWalls,
			simpleWallsData,
			bombsData,
			bodiesData,
			playerData,
			this._grid.object.width,
			this._grid.object.height
		)
	}

	public async InitStartData(): Promise<unknown> {
		await this.InitStartDataWithTimeout(
			new BombermanControllerData(this.GetMapData())
		).catch(reason => console.warn(reason))
		return Promise.resolve()
	}

	public async CalcAndExecuteCommand(turnIndex: number): Promise<unknown> {
		const command = await this.GetCommandWithTimeout(
			new BombermanControllerData(this.GetMapData()),
			turnIndex
		).catch(reason => {
			console.warn(reason)
			return BombermanControllerCommand.GetIdleCommand()
		})

		const safeRef = this.gameObject.scene
			.GetReadonlyContainer()
			.GetSafeRefForObject(this.gameObject)
		switch (command.bombermanAction) {
			case BombermanActions.idle:
				//idle
				break
			case BombermanActions.up:
				this._grid.object.TryMoveObject(
					safeRef,
					this.gameObject.position.Add(new Vector2(0, 1))
				)
				break
			case BombermanActions.right:
				this._grid.object.TryMoveObject(
					safeRef,
					this.gameObject.position.Add(new Vector2(1, 0))
				)
				break
			case BombermanActions.down:
				this._grid.object.TryMoveObject(
					safeRef,
					this.gameObject.position.Add(new Vector2(0, -1))
				)
				break
			case BombermanActions.left:
				this._grid.object.TryMoveObject(
					safeRef,
					this.gameObject.position.Add(new Vector2(-1, 0))
				)
				break
			case BombermanActions.bomb:
				if (this._bombsCount == 0) return
				const bomb = this._bombSpawnFunction(
					this.gameObject.scene
						.GetReadonlyContainer()
						.GetSafeRefForObject(this.gameObject),
					this.gameObject.position,
					this._bombDamage,
					this._blastRange,
					this._ticksToExplosion
				)
				if (bomb) {
					this._bombsCount -= 1
				}
				break
			default:
				console.warn(`Unknown command - ${command}`)
				break
		}
	}

	OnFixedUpdate(index: number) {
		if (
			this._lastRestoreTurn + this._bombsRestoreTicks ===
			this.gameObject.scene.turnIndex
		) {
			this._lastRestoreTurn = this.gameObject.scene.turnIndex
			this._bombsCount = Math.min(
				this._bombsCount + this._bombsRestoreCount,
				this._bombsMaxCount
			)
		}
	}
}

export class ManBodyParameters extends ControllerBodyParameters<
	BombermanControllerData,
	BombermanControllerData,
	BombermanControllerCommand
> {
	bombDamage: number
	blastRange: number
	ticksToExplosion: number

	bombsMaxCount: number
	bombsRestoreTicks: number
	bombsRestoreCount: number

	grid: SafeReference<BombermanGrid>

	bombSpawnFunction: (
		ref: SafeReference<IGameObject>,
		position: Vector2,
		damage: number,
		range: number,
		ticksToExplosion: number
	) => SafeReference<IGameObject>

	constructor(
		controllerBridge: IAsyncControllerBridge<
			BombermanControllerData,
			BombermanControllerData,
			BombermanControllerCommand
		>,
		grid: SafeReference<BombermanGrid>,
		bombSpawnFunction: (
			ref: SafeReference<IGameObject>,
			position: Vector2,
			damage: number,
			range: number,
			ticksToExplosion: number
		) => SafeReference<IGameObject>,
		bombDamage: number = 1,
		blastRange: number = 1,
		ticksToExplosion: number = 3,
		bombsMaxCount: number = 1,
		bombsRestoreTicks: number = 3,
		bombsRestoreCount: number = 1,
		initTimeout: number = -1,
		commandCalcTimeout: number = -1,
		executionPriority: number = 0,
		uuid?: string
	) {
		super(
			controllerBridge,
			initTimeout,
			commandCalcTimeout,
			executionPriority,
			uuid
		)
		this.grid = grid
		this.bombDamage = bombDamage
		this.blastRange = blastRange
		this.ticksToExplosion = ticksToExplosion
		this.bombsMaxCount = bombsMaxCount
		this.bombSpawnFunction = bombSpawnFunction
		this.bombsRestoreTicks = bombsRestoreTicks
		this.bombsRestoreCount = bombsRestoreCount
	}
}
