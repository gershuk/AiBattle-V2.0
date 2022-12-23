import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import {
	AbstractObjectComponent,
	ComponentParameters,
} from '../AbstractObjectComponent'
import { Vector2 } from '../Vector2'
import { DiscreteMovementComponent } from './DiscreteMovementComponent'

export class CellData {
	owner: DiscreteMovementComponent | undefined
	startRentTurn: number
	endRentTurn: number | undefined

	constructor() {
		this.owner = undefined
		this.startRentTurn = 0
		this.endRentTurn = undefined
	}
}

export class DiscreteColliderSystem extends AbstractObjectComponent {
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
		width: number,
		height: number,
		owner?: IGameObject,
		parameters?: ComponentParameters
	) {
		super(owner, parameters)
		this._grid = new Array<Array<CellData>>(width)
		for (let i = 0; i < width; ++i) {
			this._grid[i] = new Array<CellData>(height)
			for (let j = 0; j < width; ++j) {
				this._grid[i][j] = new CellData()
			}
		}
	}

	public InitNewObject(owner: DiscreteMovementComponent, x: number, y: number) {
		this._grid[x][y].owner = owner
		this._grid[x][y].startRentTurn = this._turn
		this._grid[x][y].endRentTurn = undefined
	}

	public TryMove(
		owner: DiscreteMovementComponent,
		newPos: Vector2,
		movingTime: number
	): boolean {
		const endMovingTime = this._turn + movingTime - 1
		const targetCell = this._grid[newPos.x][newPos.y]
		const currentCell = this._grid[owner.oldPosition.x][owner.oldPosition.y]
		const cond =
			targetCell.owner === owner ||
			(targetCell.endRentTurn !== undefined &&
				targetCell.endRentTurn < endMovingTime)
		if (cond) {
			targetCell.owner = owner
			targetCell.startRentTurn = endMovingTime
			targetCell.endRentTurn = undefined

			currentCell.endRentTurn = endMovingTime
		}
		return cond
	}
}
