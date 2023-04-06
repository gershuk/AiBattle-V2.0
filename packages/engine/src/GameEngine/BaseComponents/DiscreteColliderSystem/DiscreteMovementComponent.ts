import { GameObjectComponent } from '../GameObjectComponent'
import { Vector2 } from '../Vector2'
import { DiscreteColliderSystem } from './DiscreteColliderSystem'
import { ComponentParameters } from '../GameObjectComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { GameObject } from 'GameEngine/GameObject/GameObject'

//ToDo : Add a number of moves for the transition and update all the moving methods.
export class DiscreteMovementComponent extends GameObjectComponent {
	private _discreteColliderSystem: DiscreteColliderSystem

	private _newPosition: Vector2
	private _oldPosition: Vector2
	private _bufferNewPosition: Vector2 | undefined
	public get newPosition(): Vector2 {
		return this._newPosition
	}
	protected set newPosition(v: Vector2) {
		this._newPosition = v
	}

	public get oldPosition(): Vector2 {
		return this._oldPosition
	}
	protected set oldPosition(v: Vector2) {
		this._oldPosition = v
	}

	public get bufferNewPosition(): Vector2 | undefined {
		return this._bufferNewPosition
	}
	public set bufferNewPosition(v: Vector2 | undefined) {
		this._bufferNewPosition = v
	}

	public get currentPosition(): Vector2 {
		return this._gameObject.position.Clone()
	}

	public SetReceiver(receiver: GameObject) {
		const position = this.currentPosition
		this._discreteColliderSystem.SetReceiver(
			this,
			position.x,
			position.y,
			receiver
		)
	}

	Init(
		gameObject: IGameObject,
		parameters?: DiscreteMovementComponentParameters
	) {
		super.Init(gameObject, parameters)
		if (parameters) {
			this._discreteColliderSystem = parameters.discreteColliderSystem
			this._discreteColliderSystem.InitNewObject(this)
			this.oldPosition = this.gameObject.position.Clone()
		}
	}

	OnDestroy(): void {
		this._discreteColliderSystem.ClearCell(
			this,
			this.currentPosition.x,
			this.currentPosition.y
		)
	}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		if (this.newPosition) {
			this.gameObject.position = Vector2.Lerp(
				this.oldPosition,
				this.newPosition,
				(currentFrame + 1) / frameCount
			)
		}
	}

	OnFixedUpdate(index: number): void {
		if (
			this.bufferNewPosition &&
			this._discreteColliderSystem.TryMove(this, this.bufferNewPosition, 1)
		) {
			this.newPosition = this.bufferNewPosition.Clone()
		} else {
			this.newPosition = undefined
		}
		this.bufferNewPosition = undefined
	}

	OnFixedUpdateEnded(index: number): void {
		if (this.newPosition) {
			if (
				this._discreteColliderSystem.GetCellData(
					this.oldPosition.x,
					this.oldPosition.y
				).owner === this
			) {
				this._discreteColliderSystem.ClearCell(
					this,
					this.oldPosition.x,
					this.oldPosition.y
				)
			}

			this.oldPosition = this.newPosition.Clone()
		}

		this.gameObject.position = this.oldPosition.Clone()
	}
}

export class DiscreteMovementComponentParameters extends ComponentParameters {
	discreteColliderSystem: DiscreteColliderSystem

	constructor(
		discreteColliderSystem: DiscreteColliderSystem,
		executionPriority: number = -100,
		uuid?: string
	) {
		super(executionPriority, uuid)
		this.discreteColliderSystem = discreteColliderSystem
	}
}
