import {
	AbstractObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { DiscreteMovementComponent } from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteMovementComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { GameObject } from 'GameEngine/GameObject/GameObject'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { AbstractController } from 'GameEngine/UserAIRuner/AbstractController'
import { LoadControllerFromString } from 'GameEngine/UserAIRuner/SafeEval'
import { HealthComponent } from './Health'
import {
	BodyData,
	BombData,
	MapData,
	MetalData,
	PlayerData,
	WallData,
} from './MapData'
import { Wall } from './Wall'
import { Metal } from './Metal'
import { BombController } from './BombController'
import { DiscreteColliderSystem } from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteColliderSystem'

export class ManBody extends AbstractObjectComponent {
	OnFixedUpdateEnded(index: number): void {}

	private _bombSpawnFunction: (
		position: Vector2,
		damage: number,
		range: number,
		ticksToExplosion: number
	) => Promise<GameObject>
	private _controller: AbstractController
	private _movementComponent: DiscreteMovementComponent
	private _bombsMaxCount: number
	private _bombsCount: number
	private _bombsRestoreTicks: number
	private _bombsRestoreCount: number
	private _lastRestoreTurn: number
	private _healthComponent: HealthComponent
	private _discreteColliderSystem: DiscreteColliderSystem

	Init(owner: IGameObject, parameters?: ManBodyParameters): void {
		super.Init(owner, parameters)
		if (parameters) {
			this._lastRestoreTurn = this.owner.owner.turnIndex
			this._controller = parameters.controller
			this._bombSpawnFunction = parameters.bombSpawnFunction
			this._bombsMaxCount = parameters.bombsMaxCount
			this._bombsCount = this._bombsMaxCount
			this._bombsRestoreTicks = parameters.bombsRestoreTicks
			this._bombsRestoreCount = parameters.bombsRestoreCount
			this._discreteColliderSystem = parameters.discreteColliderSystem
		}
	}

	public GetBodyData(): BodyData {
		return new BodyData(
			this.owner.position.Clone(),
			this._healthComponent.health,
			this.uuid
		)
	}

	public GetPlayerData(): PlayerData {
		return new PlayerData(
			this.owner.position.Clone(),
			this._healthComponent.health,
			this._bombsMaxCount,
			this._bombsCount,
			this._bombsRestoreTicks,
			this._bombsRestoreCount,
			this._lastRestoreTurn,
			this.uuid
		)
	}

	OnOwnerInit(): void {
		this._healthComponent = this.owner.GetComponents(HealthComponent)[0] as any
	}

	OnDestroy(): void {}

	OnSceneStart(): void {
		this._movementComponent = this.owner.GetComponents(
			DiscreteMovementComponent
		)[0] as unknown as DiscreteMovementComponent
	}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}

	public GetMapData(): MapData {
		const wallsData: WallData[] = []
		const metalsData: MetalData[] = []
		const bombsData: BombData[] = []
		const bodiesData: BodyData[] = []
		const playerData = this.GetPlayerData()
		const objects: GameObject[] = this.owner.owner.gameObjects

		for (let object of objects) {
			if (object === this.owner) continue

			const wallData = object.GetComponents(Wall)[0]?.GetData()
			const metalData = object.GetComponents(Metal)[0]?.GetData()
			const bombData = object.GetComponents(BombController)[0]?.GetData()
			const bodyData = object.GetComponents(ManBody)[0]?.GetData()

			if (wallData) wallsData.push(wallData)
			if (metalData) metalsData.push(metalData)
			if (bombData) bombsData.push(bombData)
			if (bodyData) bodiesData.push(bodyData)
		}
		return new MapData(
			wallsData,
			metalsData,
			bombsData,
			bodiesData,
			playerData,
			this._discreteColliderSystem.width,
			this._discreteColliderSystem.height
		)
	}

	async OnFixedUpdate(index: number) {
		const command = this._controller.GetCommand(this.GetMapData())
		if (
			this._lastRestoreTurn + this._bombsRestoreTicks ===
			this.owner.owner.turnIndex
		) {
			this._lastRestoreTurn = this.owner.owner.turnIndex
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
				this._movementComponent.bufferNewPosition =
					this._movementComponent.currentPosition.Add(new Vector2(0, 1))
				break
			case 2:
				this._movementComponent.bufferNewPosition =
					this._movementComponent.currentPosition.Add(new Vector2(1, 0))
				break
			case 3:
				this._movementComponent.bufferNewPosition =
					this._movementComponent.currentPosition.Add(new Vector2(0, -1))
				break
			case 4:
				this._movementComponent.bufferNewPosition =
					this._movementComponent.currentPosition.Add(new Vector2(-1, 0))
				break
			case 5:
				const bomb = await this._bombSpawnFunction(
					this._movementComponent.currentPosition,
					1,
					1,
					3
				)
				if (bomb && this._bombsCount > 0) {
					this._bombsCount -= 1
					this._movementComponent.SetReceiver(bomb)
				}
				break
			default:
				console.warn(`Unknown command - ${command}`)
				break
		}
	}
}

export class ManBodyParameters extends ComponentParameters {
	discreteColliderSystem: DiscreteColliderSystem
	controller: AbstractController
	bombsMaxCount: number
	bombsRestoreTicks: number
	bombsRestoreCount: number
	bombSpawnFunction: (
		position: Vector2,
		damage: number,
		range: number,
		ticksToExplosion: number
	) => Promise<GameObject>
	constructor(
		controllerText: string,
		discreteColliderSystem: DiscreteColliderSystem,
		bombSpawnFunction: (
			position: Vector2,
			damage: number,
			range: number,
			ticksToExplosion: number
		) => Promise<GameObject>,
		bombsMaxCount: number = 1,
		bombsRestoreTicks: number = 3,
		bombsRestoreCount: number = 1
	) {
		super()
		this.discreteColliderSystem = discreteColliderSystem
		this.controller = LoadControllerFromString(controllerText)
		this.bombsMaxCount = bombsMaxCount
		this.bombSpawnFunction = bombSpawnFunction
		this.bombsRestoreTicks = bombsRestoreTicks
		this.bombsRestoreCount = bombsRestoreCount
	}
}
