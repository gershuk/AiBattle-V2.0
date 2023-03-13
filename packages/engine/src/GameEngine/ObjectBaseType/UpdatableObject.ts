import { Object } from './Object'

export abstract class UpdatableObject extends Object {
	private _executionPriority: number

	protected set executionPriority(v: number) {
		this._executionPriority = v
	}
	public get executionPriority(): number {
		return this._executionPriority
	}

	abstract OnStart(): void

	abstract OnBeforeFrameRender(currentFrame: number, frameCount: number): void

	abstract OnAfterFrameRender(currentFrame: number, frameCount: number): void

	abstract OnFixedUpdateEnded(index: number): void

	abstract OnFixedUpdate(index: number): void

	abstract OnDestroy(): void
}
