import {
	ComponentParameters,
	GameObjectComponent,
} from '../GameObjectComponent'
import { Vector2 } from '../Vector2'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

export class ObjectMovementData {
	ref: SafeReference<IGameObject>
	oldPosition: Vector2
	newPosition: Vector2 | null

	constructor(ref: SafeReference<IGameObject>) {
		this.ref = ref
		this.oldPosition = this.ref.object.position
		this.newPosition = null
	}
}

export abstract class GridWorldSystem extends GameObjectComponent {
	protected _objectsMovementData: { [key: string]: ObjectMovementData } = {}
	protected _commandReceiveLock: boolean = false
	protected _grid: ObjectMovementData[][][] = []

	public get commandReceiveLock(): boolean {
		return this._commandReceiveLock
	}
	protected set commandReceiveLock(v: boolean) {
		this._commandReceiveLock = v
	}

	public abstract CanInitObject(ref: SafeReference<IGameObject>): boolean

	public Init(
		gameObject: IGameObject,
		parameters?: GridWorldSystemParameters
	): void {
		super.Init(gameObject, parameters)
	}

	public GetCellData(position: Vector2): ObjectMovementData[] | null {
		if (
			this._grid[position.x] === undefined ||
			this._grid[position.x][position.y] === undefined
		) {
			return null
		}

		return this._grid[position.x][position.y]
	}

	protected AddObjectMovementDataToCell(
		objectsMovementData: ObjectMovementData,
		position: Vector2
	): void {
		if (this._grid[position.x] === undefined) {
			this._grid[position.x] = []
		}

		if (this._grid[position.x][position.y] === undefined) {
			this._grid[position.x][position.y] = []
		}

		this._grid[position.x][position.y].push(objectsMovementData)
	}

	protected RemoveObjectMovementDataFromCell(
		objectsMovementData: ObjectMovementData,
		position: Vector2
	): boolean {
		if (
			this._grid[position.x] === undefined ||
			this._grid[position.x][position.y] === undefined
		) {
			return false
		}

		const index =
			this._grid[position.x][position.y].indexOf(objectsMovementData)

		if (index == -1) {
			return false
		}

		this._grid[position.x][position.y].splice(index, 1)

		return true
	}

	public TryUnregisterObject(ref: SafeReference<IGameObject>): boolean {
		const data = this._objectsMovementData[ref.object.uuid]

		if (data === undefined) {
			console.warn('Object not registered')
			return false
		}

		this.RemoveObjectMovementDataFromCell(data, data.oldPosition)
		if (data.newPosition)
			this.RemoveObjectMovementDataFromCell(data, data.newPosition)

		delete this._objectsMovementData[ref.object.uuid]

		return true
	}

	public TryRegisterObject(ref: SafeReference<IGameObject>): boolean {
		if (this.commandReceiveLock) {
			console.warn(`Receiving of movement commands is blocked (moving phase).`)
			return false
		}

		if (!this.CanInitObject(ref)) {
			console.warn(
				`Can't init object uuid:${
					ref.object.uuid
				} at position ${ref.object.position.ToString()}`
			)
			return false
		}

		const movementData = new ObjectMovementData(ref)
		this._objectsMovementData[ref.object.uuid] = movementData
		this.AddObjectMovementDataToCell(movementData, ref.object.position)

		return true
	}

	public abstract CanObjectMoveTo(
		ref: SafeReference<IGameObject>,
		newPosition: Vector2
	): boolean

	public TryMoveObject(ref: SafeReference<IGameObject>, newPosition: Vector2) {
		if (this.commandReceiveLock) {
			console.warn(`Receiving of movement commands is blocked (moving phase).`)
			return false
		}

		if (!this.CanObjectMoveTo(ref, newPosition)) {
			console.warn(
				`Can't move object uuid:${
					ref.object.uuid
				} at position ${newPosition.ToString()}`
			)
			return false
		}

		const data = this._objectsMovementData[ref.object.uuid]

		if (data.newPosition) {
			this.RemoveObjectMovementDataFromCell(data, data.newPosition)
		}

		data.newPosition = newPosition.Clone()

		this.AddObjectMovementDataToCell(data, data.newPosition)
	}

	public OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		for (let key in this._objectsMovementData) {
			const data = this._objectsMovementData[key]
			if (data.newPosition) {
				data.ref.object.position = Vector2.Lerp(
					data.oldPosition,
					data.newPosition,
					(currentFrame + 1) / frameCount
				)
			}
		}
	}

	public abstract CheckAndFixMovementExceptions(): void

	public OnFixedUpdate(index: number): void {
		this.commandReceiveLock = true
		this.CheckAndFixMovementExceptions()
	}

	public OnFixedUpdateEnded(index: number): void {
		for (let key in this._objectsMovementData) {
			const data = this._objectsMovementData[key]

			if (data.newPosition) {
				this.RemoveObjectMovementDataFromCell(data, data.oldPosition)
				data.oldPosition = data.newPosition.Clone()
			}

			data.newPosition = null
		}

		this.commandReceiveLock = false
	}
}

export class GridWorldSystemParameters extends ComponentParameters {
	constructor(executionPriority: number = -100, uuid?: string) {
		super(executionPriority, uuid)
	}
}
