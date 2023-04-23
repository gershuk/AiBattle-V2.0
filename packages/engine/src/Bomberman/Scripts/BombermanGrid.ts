import {
	GridWorldSystem,
	GridWorldSystemParameters,
} from 'GameEngine/BaseComponents/GridWorldSystem/GridWorldSystem'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { GameObject } from 'GameEngine/GameObject/GameObject'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import { ManBody } from './ManBody'
import { BombController } from './BombController'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

export class BombermanGrid extends GridWorldSystem {
	//ToDo : secure if 1 of the objects canceled the transition (although this is not possible now)

	private _width: number
	private _height: number

	public get width(): number {
		return this._width
	}
	protected set width(v: number) {
		this._width = v
	}

	public get height(): number {
		return this._height
	}
	protected set height(v: number) {
		this._height = v
	}

	public Init(
		gameObjectRef: SafeReference<IGameObject>,
		parameters?: BombermanGridParameters
	): void {
		super.Init(gameObjectRef, parameters)

		if (parameters) {
			this.width = parameters.width
			this.height = parameters.height
		}
	}

	public CheckAndFixMovementExceptions(): void {}

	public CanInitObject(ref: SafeReference<IGameObject>): boolean {
		const cellData = this.GetCellData(ref.object.position)
		return (
			cellData == null ||
			cellData.length == 0 ||
			(cellData.length == 1 &&
				cellData[0].ref.object.GetComponents(ManBody).length == 1 &&
				ref.object.GetComponents(BombController).length == 1)
		)
	}

	public CanObjectMoveTo(
		ref: SafeReference<IGameObject>,
		newPosition: Vector2
	): boolean {
		const cellData = this.GetCellData(newPosition)
		if (cellData == null) return true

		for (let data of cellData) {
			if (data) {
				if (data.newPosition == null || data.newPosition.Equal(newPosition)) {
					return false
				}
			}
		}
		return true
	}

	public CanCreateBomb(
		ref: SafeReference<IGameObject>,
		position: Vector2
	): boolean {
		const data = this.GetCellData(position)

		return data.length == 0 || (data.length == 1 && data[0].ref == ref)
	}
}

export class BombermanGridParameters extends GridWorldSystemParameters {
	width: number
	height: number

	constructor(
		width: number,
		height: number,
		executionPriority: number = -100,
		label?: string
	) {
		super(executionPriority, label)
		this.width = width
		this.height = height
	}
}
