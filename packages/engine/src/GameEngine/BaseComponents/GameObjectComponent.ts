import { GenerateUUID } from 'Utilities'
import { IGameObject } from '../GameObject/IGameObject'
import { UpdatableObject } from 'GameEngine/ObjectBaseType/UpdatableObject'

export class GameObjectComponent extends UpdatableObject {
	protected _gameObject: IGameObject | undefined

	public get gameObject(): IGameObject {
		return this._gameObject
	}

	Init(gameObject: IGameObject, parameters?: ComponentParameters) {
		this._gameObject = gameObject
		if (parameters) {
			this._uuid = parameters.uuid
			this.executionPriority = parameters.executionPriority
		} else {
			this._uuid = GenerateUUID()
			this.executionPriority = 0
		}
	}

	OnStart(): void {}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}

	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}

	OnFixedUpdateEnded(index: number): void {}

	OnFixedUpdate(index: number): void {}

	OnDestroy(): void {}

	OnOwnerInit(): void {}

	OnOwnerAddedToGroup(): void {}

	OnAddedToGroup(): void {}

	OnObjectCreationStage(index: number): void {}
}

export class ComponentParameters {
	uuid: string
	executionPriority: number
	constructor(executionPriority: number = 0, uuid?: string) {
		this.executionPriority = executionPriority
		this.uuid = uuid ?? GenerateUUID()
	}
}
