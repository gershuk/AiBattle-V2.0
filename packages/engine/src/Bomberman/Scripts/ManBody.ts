import {
	GameObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/GameObjectComponent'
import { DiscreteMovementComponent } from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteMovementComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { GameObject } from 'GameEngine/GameObject/GameObject'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { AbstractController } from 'GameEngine/UserAIRuner/AbstractController'
import { LoadControllerFromString } from 'GameEngine/UserAIRuner/SafeEval'
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

export class ManBody extends GameObjectComponent {
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

	private _controller: AbstractController

	Init(gameObject: IGameObject, parameters?: ManBodyParameters): void {
		super.Init(gameObject, parameters)
		if (parameters) {
			this._bombSpawnFunction = parameters.bombSpawnFunction

			this._bombDamage = parameters.bombDamage
			this._blastRange = parameters.blastRange
			this._ticksToExplosion = parameters.ticksToExplosion

			this._bombsCount = this._bombsMaxCount
			this._bombsMaxCount = parameters.bombsMaxCount
			this._bombsRestoreTicks = parameters.bombsRestoreTicks
			this._bombsRestoreCount = parameters.bombsRestoreCount
			this._lastRestoreTurn = this.gameObject.scene.turnIndex

			this._discreteColliderSystem = parameters.discreteColliderSystem

			this._controller = parameters.controller
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
			this.uuid
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
			this.gameObject.scene.gameObjects

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

	OnFixedUpdate(index: number) {
		const command = this._controller.GetCommand(this.GetMapData())
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

		switch (command) {
			case 0:
				//idle
				break
			case 1:
				this._movementComponentRef.object.bufferNewPosition =
					this._movementComponentRef.object.currentPosition.Add(
						new Vector2(0, 1)
					)
				break
			case 2:
				this._movementComponentRef.object.bufferNewPosition =
					this._movementComponentRef.object.currentPosition.Add(
						new Vector2(1, 0)
					)
				break
			case 3:
				this._movementComponentRef.object.bufferNewPosition =
					this._movementComponentRef.object.currentPosition.Add(
						new Vector2(0, -1)
					)
				break
			case 4:
				this._movementComponentRef.object.bufferNewPosition =
					this._movementComponentRef.object.currentPosition.Add(
						new Vector2(-1, 0)
					)
				break
			case 5:
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
}

export class ManBodyParameters extends ComponentParameters {
	bombDamage: number
	blastRange: number
	ticksToExplosion: number

	bombsMaxCount: number
	bombsRestoreTicks: number
	bombsRestoreCount: number

	discreteColliderSystem: DiscreteColliderSystem
	controller: AbstractController

	bombSpawnFunction: (
		position: Vector2,
		damage: number,
		range: number,
		ticksToExplosion: number
	) => GameObject

	constructor(
		controllerText: string,
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
		bombsRestoreCount: number = 1
	) {
		super()
		this.discreteColliderSystem = discreteColliderSystem
		this.controller = LoadControllerFromString(controllerText)
		this.bombDamage = bombDamage
		this.blastRange = blastRange
		this.ticksToExplosion = ticksToExplosion
		this.bombsMaxCount = bombsMaxCount
		this.bombSpawnFunction = bombSpawnFunction
		this.bombsRestoreTicks = bombsRestoreTicks
		this.bombsRestoreCount = bombsRestoreCount
	}
}
