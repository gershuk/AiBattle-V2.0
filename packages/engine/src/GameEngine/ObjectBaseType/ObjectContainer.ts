import { UpdatableObject } from './UpdatableObject'

export interface IReadOnlyObjectContainer<T extends UpdatableObject>
	extends Iterable<SafeReference<T>> {
	GetSafeRefsByFilter(
		filter: (o: SafeReference<T>) => boolean
	): SafeReference<T>[]
	GetSafeRefForObject(object: T): SafeReference<T>
}

export interface IObjectContainer<T extends UpdatableObject>
	extends IReadOnlyObjectContainer<T> {
	Add(object: T): SafeReference<T>
	DestroyObjectsByFilter(filter: (o: SafeReference<T>) => boolean): void
	ClearDestroyed(): void
}

export class SafeReference<T extends UpdatableObject> {
	private _object: T

	private _isDestroyed: boolean
	private _isAdded: boolean

	public get object(): T {
		if (this.isDestroyed) throw new Error('Object is destroyed')
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

	public get isAdded(): boolean {
		return this._isAdded
	}

	protected set isAdded(v: boolean) {
		this._isAdded = v
	}

	constructor(object: T) {
		this.object = object
		this.isDestroyed = false
		this.isAdded = false
	}

	public SetAdded() {
		if (this.isDestroyed) throw new Error('Object is destroyed')
		if (this.isAdded) throw new Error('Object already added')
		this.isAdded = true
		this.object.OnAddedToGroup()
	}

	public Destroy() {
		this.object.OnDestroy()
		this.object = null
		this.isDestroyed = true
	}
}
