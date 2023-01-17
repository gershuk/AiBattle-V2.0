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

export class BodyData {
	position: Vector2
	health: number
	uuid: string

	constructor(position: Vector2, health: number, uuid: string) {
		this.position = position
		this.health = health
		this.uuid = uuid
	}
}

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

			this._healthComponent = this.owner.GetComponents(
				HealthComponent
			)[0] as any
		}
	}

	public BodyData(): BodyData {
		return new BodyData(
			this.owner.position.Clone(),
			this._healthComponent.health,
			this.uuid
		)
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}

	OnSceneStart(): void {
		this._movementComponent = this.owner.GetComponents(
			DiscreteMovementComponent
		)[0] as unknown as DiscreteMovementComponent
	}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}

	async OnFixedUpdate(index: number) {
		const command = this._controller.GetCommand({})
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
		this.controller = LoadControllerFromString(controllerText)
		this.bombsMaxCount = bombsMaxCount
		this.bombSpawnFunction = bombSpawnFunction
		this.bombsRestoreTicks = bombsRestoreTicks
		this.bombsRestoreCount = bombsRestoreCount
	}
}
