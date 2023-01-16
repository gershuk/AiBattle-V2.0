import { GenerateUUID } from 'Utilities'
import { IGameObject } from '../GameObject/IGameObject'

export abstract class AbstractObjectComponent {
	private _uuid: string
	public get uuid(): string {
		return this._uuid
	}
	private set uuid(v: string) {
		this._uuid = v
	}

	protected _owner: IGameObject | undefined

	public get owner(): IGameObject {
		return this._owner
	}

	constructor(owner?: IGameObject, parameters?: ComponentParameters) {
		this.Init(owner, parameters)
	}

	Init(owner: IGameObject, parameters?: ComponentParameters) {
		this._uuid = GenerateUUID()
		this._owner = owner
	}

	abstract OnOwnerInit(): void
	abstract OnDestroy(): void
	abstract OnSceneStart(): void
	abstract OnBeforeFrameRender(currentFrame: number, frameCount: number): void
	abstract OnAfterFrameRender(currentFrame: number, frameCount: number): void
	abstract OnFixedUpdate(index: number): void
	abstract OnFixedUpdateEnded(index: number): void
}

export abstract class ComponentParameters {}
