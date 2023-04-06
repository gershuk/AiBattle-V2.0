import {
	IObjectContainer,
	IReadOnlyObjectContainer,
	SafeReference,
} from './ObjectContainer'
import { UpdatableObject } from './UpdatableObject'

export abstract class UpdatableGroup<
	T extends UpdatableObject
> extends UpdatableObject {
	protected _container: IObjectContainer<T>

	public GetReadonlyContainer(): IReadOnlyObjectContainer<T> {
		return this._container
	}

	protected Add(object: T): SafeReference<T> {
		return this._container.Add(object)
	}

	protected DestroyObjectsByFilter(
		filter: (o: SafeReference<T>) => boolean
	): void {
		this._container.DestroyObjectsByFilter(filter)
	}

	protected GetSafeRefsByFilter(
		filter: (o: SafeReference<T>) => boolean
	): SafeReference<T>[] {
		return this._container.GetSafeRefsByFilter(filter)
	}

	public OnStart(): void {
		for (let ref of this._container) {
			ref.object.OnStart()
		}
	}

	public OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		for (let ref of this._container) {
			ref.object.OnBeforeFrameRender(currentFrame, frameCount)
		}
	}

	public OnAfterFrameRender(currentFrame: number, frameCount: number): void {
		for (let ref of this._container) {
			ref.object.OnAfterFrameRender(currentFrame, frameCount)
		}
	}

	public OnFixedUpdateEnded(index: number): void {
		for (let ref of this._container) {
			ref.object.OnFixedUpdateEnded(index)
		}
		this._container.ClearDestroyed()
	}

	public OnFixedUpdate(index: number): void {
		for (let ref of this._container) {
			ref.object.OnFixedUpdate(index)
		}
	}

	public OnDestroy(): void {
		//Children's OnDestory called in DestroyObjectsByFilter
		this.DestroyObjectsByFilter(() => true)
		this._container.ClearDestroyed()
	}
}
