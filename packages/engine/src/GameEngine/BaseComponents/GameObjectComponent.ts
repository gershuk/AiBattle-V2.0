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
			this._label = parameters.label ?? this.uuid
			this.executionPriority = parameters.executionPriority
		} else {
			this._label = this.uuid
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
	label: string
	executionPriority: number
	constructor(executionPriority: number = 0, label?: string) {
		this.executionPriority = executionPriority
		this.label = label
	}
}
