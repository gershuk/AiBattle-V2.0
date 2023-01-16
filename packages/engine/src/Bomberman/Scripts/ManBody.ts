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

	Init(owner: IGameObject, parameters?: ManBodyParameters): void {
		super.Init(owner, parameters)
		if (parameters) {
			this._controller = parameters.controller
			this._bombSpawnFunction = parameters.bombSpawnFunction
		}
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
				if (bomb) this._movementComponent.SetReceiver(bomb)
				break
			default:
				console.warn(`Unknown command - ${command}`)
				break
		}
	}
}

export class ManBodyParameters extends ComponentParameters {
	controller: AbstractController
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
		) => Promise<GameObject>
	) {
		super()
		this.controller = LoadControllerFromString(controllerText)
		this.bombSpawnFunction = bombSpawnFunction
	}
}
