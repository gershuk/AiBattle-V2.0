import { AbstractObjectComponent } from '../AbstractObjectComponent'
import { Vector2 } from '../Vector2'
import { DiscreteColliderSystem } from './DiscreteColliderSystem'
import { ComponentParameters } from '../AbstractObjectComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

//ToDo : Add a number of moves for the transition and update all the moving methods.
export class DiscreteMovementComponent extends AbstractObjectComponent {
	private _discreteColliderSystem: DiscreteColliderSystem

	private _turn: number

	private _newPosition: Vector2
	public get newPosition(): Vector2 {
		return this._newPosition
	}
	protected set newPosition(v: Vector2) {
		this._newPosition = v
	}

	private _oldPosition: Vector2
	public get oldPosition(): Vector2 {
		return this._oldPosition
	}
	protected set oldPosition(v: Vector2) {
		this._oldPosition = v
	}

	private _bufferNewPosition: Vector2 | undefined
	public get bufferNewPosition(): Vector2 | undefined {
		return this._bufferNewPosition
	}
	public set bufferNewPosition(v: Vector2 | undefined) {
		this._bufferNewPosition = v
	}

	Init(owner: IGameObject, parameters?: ComponentParameters) {
		super.Init(owner, parameters)
		if (parameters instanceof DiscreteMovementComponentParameters) {
			this._discreteColliderSystem = parameters.discreteColliderSystem
		}
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {
		this._discreteColliderSystem.InitNewObject(this)
		this.oldPosition = this.owner.position.Clone()
	}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		if (this.newPosition) {
			this.owner.position = Vector2.Lerp(
				this.oldPosition,
				this.newPosition,
				(currentFrame + 1) / frameCount
			)
		}
	}

	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}

	OnFixedUpdate(index: number): void {
		this._turn = index
		this.oldPosition = this.owner.position.Clone()
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
}

export class DiscreteMovementComponentParameters extends ComponentParameters {
	discreteColliderSystem: DiscreteColliderSystem

	constructor(discreteColliderSystem: DiscreteColliderSystem) {
		super()
		this.discreteColliderSystem = discreteColliderSystem
	}
}
