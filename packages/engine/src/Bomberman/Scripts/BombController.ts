import {
	GameObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/GameObjectComponent'
import { DiscreteColliderSystem } from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteColliderSystem'
import {
	DiscreteMovementComponent,
	DiscreteMovementComponentParameters,
} from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteMovementComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { HealthComponent } from './Health'
import { DestructibleWall } from './DestructibleWall'
import { Wall } from './Wall'
import { BombData } from './MapData'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export class BombController extends GameObjectComponent {
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

	public GetData(): BombData {
		return new BombData(
			this.gameObject.position.Clone(),
			this._turnToExplosion,
			this._damage,
			this._range,
			this.uuid
		)
	}

	Init(gameObject: IGameObject, parameters?: BombControllerParameters): void {
		super.Init(gameObject, parameters)
		if (parameters) {
			this._turnToExplosion =
				(gameObject.scene.turnIndex ? gameObject.scene.turnIndex : 1) +
				parameters.ticksToExplosion
			this._discreteColliderSystem = parameters.discreteColliderSystem
			this._damage = parameters.damage
			this._range = parameters.range
			this._blastSpawnFunction = parameters.blastSpawnFunction
		}
	}

	OnFixedUpdate(index: number): void {
		if (
			this._discreteColliderSystem.CanInit(
				this.gameObject.position.x,
				this.gameObject.position.y
			)
		) {
			this.gameObject.AddComponents([
				[
					new DiscreteMovementComponent(),
					new DiscreteMovementComponentParameters(this._discreteColliderSystem),
				],
			])
		}

		if (index === this._turnToExplosion) {
			this.gameObject.scene.RemoveGameObjectsByFilter(
				r => this.gameObject == r.object
			)
			this.DamageTile(this.gameObject.position)

			for (let dir of this._pattern) {
				for (let i = 1; i <= this._range; ++i) {
					const pos = this.gameObject.position.Add(dir.MulScalar(i))
					const cellOwner = this._discreteColliderSystem.GetCellData(
						pos.x,
						pos.y
					).owner
					const destructibleWall =
						cellOwner?.gameObject?.GetComponents(DestructibleWall)
					const wall = cellOwner?.gameObject?.GetComponents(Wall)
					if (wall && wall.length > 0) break
					if (destructibleWall && destructibleWall.length > 0) {
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
		let cellOwner = this._discreteColliderSystem.GetCellData(
			position.x,
			position.y
		).owner

		if (cellOwner) {
			let healthComponent = cellOwner.gameObject.GetComponents(
				HealthComponent
			)[0] as SafeReference<HealthComponent>
			if (healthComponent) {
				healthComponent.object.TakeDamage(this._damage)
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
