import {
	AbstractObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { DiscreteColliderSystem } from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteColliderSystem'
import {
	DiscreteMovementComponent,
	DiscreteMovementComponentParameters,
} from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteMovementComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { HealthComponent } from './Health'
import { Wall } from './Wall'
import { Metal } from './Metal'

export class BombController extends AbstractObjectComponent {
	OnFixedUpdateEnded(index: number): void {}

	private _pattern: Vector2[] = [
		new Vector2(1, 0),
		new Vector2(-1, 0),
		new Vector2(0, 1),
		new Vector2(0, -1),
	]

	private _turnToExplosion: number
	private _discreteColliderSystem: DiscreteColliderSystem
	private _damage: number
	private _range: number
	private _blastSpawnFunction: Function

	Init(owner: IGameObject, parameters?: BombControllerParameters): void {
		super.Init(owner, parameters)
		if (parameters) {
			this._turnToExplosion =
				(owner.owner.turnIndex ? owner.owner.turnIndex : 1) +
				parameters.ticksToExplosion
			this._discreteColliderSystem = parameters.discreteColliderSystem
			this._damage = parameters.damage
			this._range = parameters.range
			this._blastSpawnFunction = parameters.blastSpawnFunction
		}
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {
		if (
			this._discreteColliderSystem.CanInit(
				this.owner.position.x,
				this.owner.position.y
			)
		) {
			this.owner.AddComponents([
				new DiscreteMovementComponent(),
				new DiscreteMovementComponentParameters(this._discreteColliderSystem),
			])
		}
		if (index === this._turnToExplosion) {
			this.owner.owner.RemoveGameObjectsByFilter(g => this.owner === g)
			this.DamageTile(this.owner.position)

			for (let dir of this._pattern) {
				for (let i = 1; i <= this._range; ++i) {
					const pos = this.owner.position.Add(dir.MulScalar(i))
					const owner = this._discreteColliderSystem.GetCellData(
						pos.x,
						pos.y
					).owner
					const wall = owner?.owner?.GetComponents(Wall)
					const metal = owner?.owner?.GetComponents(Metal)
					if (metal && metal.length > 0) break
					if (wall && wall.length > 0) {
						this.DamageTile(pos)
						break
					}
					this.DamageTile(pos)
				}
			}
		}
	}

	private DamageTile(position: Vector2) {
		this._blastSpawnFunction(position)
		let owner = this._discreteColliderSystem.GetCellData(
			position.x,
			position.y
		).owner

		if (owner) {
			let healthComponent = owner.owner.GetComponents(
				HealthComponent
			)[0] as any as HealthComponent
			if (healthComponent) {
				healthComponent.TakeDamage(this._damage)
			}
		}
	}
}

export class BombControllerParameters extends ComponentParameters {
	damage: number
	range: number
	ticksToExplosion: number
	discreteColliderSystem: DiscreteColliderSystem
	blastSpawnFunction: Function
	constructor(
		discreteColliderSystem: DiscreteColliderSystem,
		blastSpawnFunction: Function,
		damage: number = 1,
		range: number = 1,
		ticksToExplosion: number = 3
	) {
		super()
		this.blastSpawnFunction = blastSpawnFunction
		this.discreteColliderSystem = discreteColliderSystem
		this.damage = damage
		this.range = range
		this.ticksToExplosion = ticksToExplosion
	}
}
