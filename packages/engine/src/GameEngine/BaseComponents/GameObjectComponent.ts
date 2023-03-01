import { GenerateUUID } from 'Utilities'
import { IGameObject } from '../GameObject/IGameObject'

//ToDo : Remove abstract
export abstract class GameObjectComponent {
	private _executionPriority: number

	protected set executionPriority(v: number) {
		this._executionPriority = v
	}
	public get executionPriority(): number {
		return this._executionPriority
	}

	private _uuid: string
	public get uuid(): string {
		return this._uuid
	}
	private set uuid(v: string) {
		this._uuid = v
	}

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

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {}
	OnFixedUpdateEnded(index: number): void {}
}

export class ComponentParameters {
	uuid: string
	executionPriority: number
	constructor(executionPriority: number = 0, uuid?: string) {
		this.executionPriority = executionPriority
		this.uuid = uuid ?? GenerateUUID()
	}
}
