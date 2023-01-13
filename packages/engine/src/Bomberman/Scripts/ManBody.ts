import {
	AbstractObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { DiscreteMovementComponent } from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteMovementComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { AbstractController } from 'GameEngine/UserAIRuner/AbstractController'
import { LoadControllerFromString } from 'GameEngine/UserAIRuner/SafeEval'

export class ManBody extends AbstractObjectComponent {
	controller: AbstractController
	movementComponent: DiscreteMovementComponent
	Init(owner: IGameObject, parameters?: ManBodyParameters): void {
		super.Init(owner, parameters)
		if (parameters) this.controller = parameters.controller
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {
		this.movementComponent = this.owner.GetComponents(
			DiscreteMovementComponent
		)[0] as unknown as DiscreteMovementComponent
	}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {
		const command = this.controller.GetCommand({})
		switch (command) {
			case 0:
				this.movementComponent.bufferNewPosition =
					this.movementComponent.currentPosition.Add(new Vector2(0, 1))
				break
			case 1:
				this.movementComponent.bufferNewPosition =
					this.movementComponent.currentPosition.Add(new Vector2(1, 0))
				break
			case 2:
				this.movementComponent.bufferNewPosition =
					this.movementComponent.currentPosition.Add(new Vector2(0, -1))
				break
			case 3:
				this.movementComponent.bufferNewPosition =
					this.movementComponent.currentPosition.Add(new Vector2(-1, 0))
				break
			default:
				throw 'Unknown command'
		}
	}
}

export class ManBodyParameters extends ComponentParameters {
	controller: AbstractController
	constructor(controllerText: string) {
		super()
		this.controller = LoadControllerFromString(controllerText)
	}
}
