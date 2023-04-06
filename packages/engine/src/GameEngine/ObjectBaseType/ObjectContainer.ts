import { UpdatableObject } from './UpdatableObject'

export interface IObjectContainer<T extends UpdatableObject>
	extends Iterable<SafeReference<T>> {
	Add(object: T): SafeReference<T>
	GetSafeRefsByFilter(
		filter: (o: SafeReference<T>) => boolean
	): SafeReference<T>[]
	DestroyObjectsByFilter(filter: (o: SafeReference<T>) => boolean): void
	ClearDestroyed(): void
	Count(): number
	AliveCount(): number
}

export class SafeReference<T extends UpdatableObject> {
	private _object: T

	private _isDestroyed: boolean
	public get object(): T {
		if (this._isDestroyed) throw new Error('Object is destroyed')
		return this._object
	}

	protected set object(v: T) {
		this._object = v
	}

	public get isDestroyed(): boolean {
		return this._isDestroyed
	}

	protected set isDestroyed(v: boolean) {
		this._isDestroyed = v
	}

	constructor(object: T) {
		this.object = object
		this.isDestroyed = false
	}

	public Destroy() {
		this.object.OnDestroy()
		this.object = null
		this.isDestroyed = true
	}
}
