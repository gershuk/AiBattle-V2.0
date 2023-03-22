import { DiscreteMovementComponent } from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteMovementComponent'
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
import { DiscreteColliderSystem } from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteColliderSystem'
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

export class ManBody extends ControllerBody<
	BombermanControllerData,
	BombermanControllerData,
	BombermanControllerCommand
> {
	private _bombSpawnFunction: (
		position: Vector2,
		damage: number,
		range: number,
		ticksToExplosion: number
	) => GameObject

	private _bombDamage: number
	private _blastRange: number
	private _ticksToExplosion: number

	private _bombsCount: number
	private _bombsMaxCount: number
	private _bombsRestoreTicks: number
	private _bombsRestoreCount: number
	private _lastRestoreTurn: number

	private _movementComponentRef: SafeReference<DiscreteMovementComponent>
	private _healthComponent: SafeReference<HealthComponent>
	private _discreteColliderSystem: DiscreteColliderSystem

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

			this._discreteColliderSystem = parameters.discreteColliderSystem
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

		this._movementComponentRef = this.gameObject.GetComponents(
			DiscreteMovementComponent
		)[0] as SafeReference<DiscreteMovementComponent>
	}

	public GetMapData(): MapData {
		const destructibleWalls: DestructibleWallData[] = []
		const simpleWallsData: WallData[] = []
		const bombsData: BombData[] = []
		const bodiesData: BodyPublicData[] = []
		const playerData = this.GetAllData()
		const refObjects: SafeReference<GameObject>[] =
			this.gameObject.scene.gameObjectRefs

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
			this._discreteColliderSystem.width,
			this._discreteColliderSystem.height
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
		switch (command.bombermanAction) {
			case BombermanActions.idle:
				//idle
				break
			case BombermanActions.up:
				this._movementComponentRef.object.bufferNewPosition =
					this._movementComponentRef.object.currentPosition.Add(
						new Vector2(0, 1)
					)
				break
			case BombermanActions.right:
				this._movementComponentRef.object.bufferNewPosition =
					this._movementComponentRef.object.currentPosition.Add(
						new Vector2(1, 0)
					)
				break
			case BombermanActions.down:
				this._movementComponentRef.object.bufferNewPosition =
					this._movementComponentRef.object.currentPosition.Add(
						new Vector2(0, -1)
					)
				break
			case BombermanActions.left:
				this._movementComponentRef.object.bufferNewPosition =
					this._movementComponentRef.object.currentPosition.Add(
						new Vector2(-1, 0)
					)
				break
			case BombermanActions.bomb:
				if (this._bombsCount == 0) return
				const bomb = this._bombSpawnFunction(
					this._movementComponentRef.object.currentPosition,
					this._bombDamage,
					this._blastRange,
					this._ticksToExplosion
				)
				if (bomb) {
					this._bombsCount -= 1
					this._movementComponentRef.object.SetReceiver(bomb)
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
			this._bombsCount = Math.max(
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

	discreteColliderSystem: DiscreteColliderSystem

	bombSpawnFunction: (
		position: Vector2,
		damage: number,
		range: number,
		ticksToExplosion: number
	) => GameObject

	constructor(
		controllerBridge: IAsyncControllerBridge<
			BombermanControllerData,
			BombermanControllerData,
			BombermanControllerCommand
		>,
		discreteColliderSystem: DiscreteColliderSystem,
		bombSpawnFunction: (
			position: Vector2,
			damage: number,
			range: number,
			ticksToExplosion: number
		) => GameObject,
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
		this.discreteColliderSystem = discreteColliderSystem
		this.bombDamage = bombDamage
		this.blastRange = blastRange
		this.ticksToExplosion = ticksToExplosion
		this.bombsMaxCount = bombsMaxCount
		this.bombSpawnFunction = bombSpawnFunction
		this.bombsRestoreTicks = bombsRestoreTicks
		this.bombsRestoreCount = bombsRestoreCount
	}
}
