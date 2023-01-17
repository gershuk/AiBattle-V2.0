import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import {
	AbstractObjectComponent,
	ComponentParameters,
} from '../AbstractObjectComponent'
import { Vector2 } from '../Vector2'
import { DiscreteMovementComponent } from './DiscreteMovementComponent'
import { GameObject } from 'GameEngine/GameObject/GameObject'

export class CellData {
	owner: DiscreteMovementComponent | undefined
	receiver: GameObject | undefined
	startRentTurn: number
	endRentTurn: number | undefined

	constructor(
		owner: DiscreteMovementComponent | undefined = undefined,
		receiver: GameObject | undefined = undefined,
		startRentTurn: number = 0,
		endRentTurn: number | undefined = undefined
	) {
		this.owner = owner
		this.receiver = receiver
		this.startRentTurn = startRentTurn
		this.endRentTurn = endRentTurn
	}

	public GetCopy(): CellData {
		return new CellData(
			this.owner,
			this.receiver,
			this.startRentTurn,
			this.endRentTurn
		)
	}
}

export class DiscreteColliderSystem extends AbstractObjectComponent {
	private _width: number
	private _height: number

	public get width(): number {
		return this._width
	}

	public get height(): number {
		return this._height
	}

	OnFixedUpdateEnded(index: number): void {}

	OnOwnerInit(): void {
		this._turn = 0
	}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {
		this._turn = index
	}

	_grid: Array<Array<CellData>>
	_turn: number

	constructor(
		owner?: IGameObject,
		parameters?: DiscreteColliderSystemParameters
	) {
		super(owner, parameters)
	}

	public Init(owner: IGameObject, parameters?: ComponentParameters): void {
		super.Init(owner, parameters)
		if (parameters) {
			if (parameters instanceof DiscreteColliderSystemParameters) {
				this._width = parameters.width
				this._height = parameters.height
				this._grid = new Array<Array<CellData>>(this._width)
				for (let i = 0; i < this._width; ++i) {
					this._grid[i] = new Array<CellData>(this._height)
					for (let j = 0; j < this._height; ++j) {
						this._grid[i][j] = new CellData()
					}
				}
			} else {
				throw new Error(
					'Expect parameters of type DiscreteColliderSystemParameters'
				)
			}
		}
	}

	public GetCellData(x: number, y: number): CellData {
		if (!this.CellExist(x, y)) {
			console.error(`Cell is not exist (${x} ${y})`)
		}
		return this._grid[x][y].GetCopy()
	}

	public CellExist(x: number, y: number) {
		return this._grid[x] && this._grid[x][y]
	}

	public CanInitOwner(owner: DiscreteMovementComponent) {
		const x = owner.owner.position.x
		const y = owner.owner.position.y

		if (!this.CellExist(x, y)) {
			console.error(`Cell is not exist (${x} ${y})`)
			return false
		}

		return (
			(this._grid[x][y].receiver === undefined ||
				this._grid[x][y].receiver === owner.owner) &&
			(this._grid[x][y].owner === undefined ||
				this._grid[x][y].owner === owner ||
				this._grid[x][y].endRentTurn <= this._turn)
		)
	}

	public CanInit(x: number, y: number, owner?: GameObject) {
		if (!this.CellExist(x, y)) {
			console.error(`Cell is not exist (${x} ${y})`)
			return false
		}

		return (
			(this._grid[x][y].receiver === undefined ||
				(owner !== undefined && this._grid[x][y].receiver === owner)) &&
			(this._grid[x][y].owner === undefined ||
				this._grid[x][y].endRentTurn <= this._turn)
		)
	}

	public InitNewObject(owner: DiscreteMovementComponent) {
		const x = owner.currentPosition.x
		const y = owner.currentPosition.y

		if (!this._grid[x] || !this._grid[x][y]) {
			throw new Error('Cell is not exist')
		}

		if (this.CanInitOwner(owner)) {
			this._grid[x][y].owner = owner
			this._grid[x][y].startRentTurn = this._turn
			this._grid[x][y].endRentTurn = undefined
			this._grid[x][y].receiver = undefined
		} else {
			throw new Error('Can not init in this cell')
		}
	}

	public CanMoveTo(
		owner: DiscreteMovementComponent,
		newPos: Vector2,
		movingTime: number
	): boolean {
		const endMovingTime = this._turn + movingTime - 1
		if (!this._grid[newPos.x] || !this._grid[newPos.x][newPos.y]) {
			return false
		}
		const targetCell = this._grid[newPos.x][newPos.y]
		const cond =
			(this._grid[newPos.x][newPos.y].receiver === undefined ||
				this._grid[newPos.x][newPos.y].receiver === owner.owner) &&
			(targetCell.owner === owner ||
				targetCell.owner === undefined ||
				(targetCell.endRentTurn !== undefined &&
					targetCell.endRentTurn < endMovingTime))
		return cond
	}

	public TryMove(
		owner: DiscreteMovementComponent,
		newPos: Vector2,
		movingTime: number
	): boolean {
		const cond = this.CanMoveTo(owner, newPos, movingTime)

		const targetCell = this._grid[newPos.x][newPos.y]
		const currentCell = this._grid[owner.oldPosition.x][owner.oldPosition.y]
		const endMovingTime = this._turn + movingTime - 1

		if (cond) {
			targetCell.owner = owner
			targetCell.startRentTurn = endMovingTime
			targetCell.endRentTurn = undefined
			targetCell.receiver = undefined

			currentCell.endRentTurn = endMovingTime
		}
		return cond
	}

	public ClearCell(
		owner: DiscreteMovementComponent,
		x: number,
		y: number,
		clearReceiver: boolean = false
	) {
		if (!this.CellExist(x, y)) throw new Error('Cell is not exist')
		if ((this._grid[x][y], owner === owner)) {
			this._grid[x][y].endRentTurn = undefined
			this._grid[x][y].owner = undefined
			this._grid[x][y].startRentTurn = undefined
			if (clearReceiver) this._grid[x][y].receiver = undefined
		} else console.error(`Can't clear cell (${x} ${y}) from ${owner}`)
	}

	public SetReceiver(
		owner: DiscreteMovementComponent,
		x: number,
		y: number,
		receiver: GameObject
	) {
		if (this._grid[x][y].owner === owner) {
			this._grid[x][y].receiver = receiver
		} else console.error(`Can't set receiver to cell (${x} ${y}) from ${owner}`)
	}
}

export class DiscreteColliderSystemParameters extends ComponentParameters {
	width: number
	height: number
	constructor(width: number, height: number) {
		super()
		this.width = width
		this.height = height
	}
}
