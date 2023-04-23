import { GenerateUUID } from 'Utilities'
import { IGameObject } from '../GameObject/IGameObject'
import { UpdatableObject } from 'GameEngine/ObjectBaseType/UpdatableObject'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export class GameObjectComponent extends UpdatableObject {
	protected _gameObject: SafeReference<IGameObject> | undefined

	public get gameObjectRef(): SafeReference<IGameObject> {
		return this._gameObject
	}

	Init(
		gameObjectRef: SafeReference<IGameObject>,
		parameters?: ComponentParameters
	) {
		this._gameObject = gameObjectRef
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
