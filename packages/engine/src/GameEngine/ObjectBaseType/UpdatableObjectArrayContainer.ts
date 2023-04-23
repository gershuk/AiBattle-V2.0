import { UpdatableObject } from 'GameEngine/ObjectBaseType/UpdatableObject'
import {
	IObjectContainer,
	SafeReference,
} from 'GameEngine/ObjectBaseType/ObjectContainer'
import { Queue } from 'Utilities'

export class UpdatableObjectArrayContainer<T extends UpdatableObject>
	implements IObjectContainer<T>
{
	private _hasAdded: boolean = false
	private _hasDelete: boolean = false
	private _version: number = 0
	private _references: SafeReference<T>[] = []
	private _newRefsQueue: Queue<SafeReference<T>> = new Queue()
	private _objectToRef: { [key: string]: SafeReference<T> } = {}

	public get version(): number {
		return this._version
	}

	protected set version(v: number) {
		this._version = v
	}

	protected get references(): SafeReference<T>[] {
		return this._references
	}

	protected set references(o: SafeReference<T>[]) {
		this._references = o
		this.version++
	}

	public Add(
		object: T,
		addAction?: () => void,
		destroyAction?: () => void
	): SafeReference<T> {
		const safeReference: SafeReference<T> = new SafeReference<T>(
			object,
			addAction,
			destroyAction
		)
		this._newRefsQueue.Enqueue(safeReference)
		this._hasAdded = true
		return safeReference
	}

	private Comparator(a: SafeReference<T>, b: SafeReference<T>): number {
		return (
			(b.isDestroyed ? 0 : b.object.executionPriority) -
			(a.isDestroyed ? 0 : a.object.executionPriority)
		)
	}

	public GetSafeRefsByFilter(
		filter: (s: SafeReference<T>) => boolean
	): SafeReference<T>[] {
		const refs: SafeReference<T>[] = []

		for (let ref of this.references) {
			if (ref.isDestroyed) continue
			if (filter(ref)) refs.push(ref)
		}

		return refs
	}

	public DestroyObjectsByFilter(
		filter: (s: SafeReference<T>) => boolean
	): void {
		const refs: SafeReference<T>[] = []

		for (let ref of this.references) {
			if (ref.isDestroyed) continue
			if (filter(ref)) refs.push(ref)
		}

		for (let ref of refs) {
			delete this._objectToRef[ref.object.uuid]
			ref.Destroy()
		}

		this._hasDelete = true
	}

	public Finaliaze(): void {
		if (this._hasDelete) {
			this.references = this._references.filter(
				(s: SafeReference<T>): boolean => !s.isDestroyed
			)
		}

		if (this._hasAdded) {
			const newRefs = []

			while (this._newRefsQueue.Size() > 0) {
				const ref = this._newRefsQueue.Dequeue()
				this.references.push(ref)
				newRefs.push(ref)
			}

			newRefs.sort(this.Comparator)

			for (let ref of newRefs) {
				this._objectToRef[ref.object.uuid] = ref
				ref.SetAdded()
			}
		}

		if (this._hasAdded || this._hasDelete) {
			this.references = this.references.sort(this.Comparator)
		}

		this._hasAdded = false
		this._hasDelete = false
	}

	public GetSafeRefForObject(object: T): SafeReference<T> {
		return this._objectToRef[object.uuid]
	}

	[Symbol.iterator](): Iterator<SafeReference<T>, any, undefined> {
		return new UpdatableObjectContainerIterator(
			this._references,
			() => this.version
		)
	}
}

export class UpdatableObjectContainerIterator<T extends UpdatableObject>
	implements Iterator<SafeReference<T>>
{
	private _index: number
	private _version: number
	private _references: SafeReference<T>[]
	private _getCurrentVersionNumber: () => number

	constructor(
		references: SafeReference<T>[],
		getCurrentVersionNumber: () => number
	) {
		this._references = references
		this._index = 0
		this._getCurrentVersionNumber = getCurrentVersionNumber
		this._version = this._getCurrentVersionNumber()
	}

	next(...args: [] | [undefined]): IteratorResult<SafeReference<T>, any> {
		if (this._version != this._getCurrentVersionNumber())
			throw new Error('Container version was changed')

		this.SkipToFirstAliveOrEnd()
		const result: IteratorResult<SafeReference<T>, any> = {
			done: this._index >= this._references.length,
			value:
				this._index < this._references.length
					? this._references[this._index]
					: undefined,
		}

		this._index++

		return result
	}

	private SkipToFirstAliveOrEnd() {
		while (
			this._index < this._references.length &&
			(this._references[this._index].isDestroyed ||
				!this._references[this._index].isAdded)
		)
			this._index++
	}
}
