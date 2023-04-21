import { SlimEvent } from 'Utilities'
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
	Add(
		object: T,
		addAction?: () => void,
		destroyAction?: () => void
	): SafeReference<T>
	DestroyObjectsByFilter(filter: (o: SafeReference<T>) => boolean): void
	Finaliaze(): void
}

export class SafeReference<T extends UpdatableObject> {
	private _object: T

	private _isDestroyed: boolean
	private _isAdded: boolean

	private _addAction: (() => void) | undefined
	private _destroyAction: (() => void) | undefined

	private _onHasDestroyed: SlimEvent<SafeReference<T>>
	private _onHasInitiated: SlimEvent<SafeReference<T>>

	public get onHasDestroyed(): SlimEvent<SafeReference<T>> {
		return this._onHasDestroyed
	}
	protected set onHasDestroyed(v: SlimEvent<SafeReference<T>>) {
		this._onHasDestroyed = v
	}

	public get onHasInitiated(): SlimEvent<SafeReference<T>> {
		return this._onHasInitiated
	}
	protected set onHasInitiated(v: SlimEvent<SafeReference<T>>) {
		this._onHasInitiated = v
	}

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

	constructor(object: T, addAction?: () => void, destroyAction?: () => void) {
		this.object = object
		this.isDestroyed = false
		this.isAdded = false
		this._addAction = addAction
		this._destroyAction = destroyAction

		this.onHasDestroyed = new SlimEvent()
		this.onHasInitiated = new SlimEvent()
	}

	public SetAdded() {
		if (this.isDestroyed) throw new Error('Object is destroyed')
		if (this.isAdded) throw new Error('Object already added')
		this.isAdded = true
		if (this._addAction) this._addAction()

		this.onHasInitiated.Notify(this)
	}

	public Destroy() {
		if (this._destroyAction) this._destroyAction()
		this.object.OnDestroy()
		this.object = null
		this.isDestroyed = true

		this.onHasDestroyed.Notify(this)
	}
}
