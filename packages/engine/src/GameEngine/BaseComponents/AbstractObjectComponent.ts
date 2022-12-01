import { IGameObject } from '../GameObject/IGameObject'

export abstract class AbstractObjectComponent {
	protected _owner: IGameObject | undefined

	public get Owner(): IGameObject {
		return this._owner
	}

	constructor(owner?: IGameObject, parameters?: ComponentParameters) {
		this.Init(owner, parameters)
	}

	Init(owner: IGameObject, parameters?: ComponentParameters) {
		this._owner = owner
	}

	abstract OnOwnerInit(): void
	abstract OnDestroy(): void
	abstract OnSceneStart(): void
	abstract OnBeforeFrameRender(currentFrame: number, frameCount: number): void
	abstract OnAfterFrameRender(currentFrame: number, frameCount: number): void
	abstract OnFixedUpdate(index: number): void
}

export abstract class ComponentParameters {}
