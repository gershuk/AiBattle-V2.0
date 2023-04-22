import {
	GameObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/GameObjectComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { HealthComponent } from './Health'
import { DestructibleWall } from './DestructibleWall'
import { Wall } from './Wall'
import { BombData } from './MapData'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import { BombermanGrid } from './BombermanGrid'

export class BombController extends GameObjectComponent {
	private _pattern: Vector2[] = [
		new Vector2(1, 0),
		new Vector2(-1, 0),
		new Vector2(0, 1),
		new Vector2(0, -1),
	]

	private _turnToExplosion: number
	private _grid: SafeReference<BombermanGrid>
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
			this._grid = parameters.grid
			this._damage = parameters.damage
			this._range = parameters.range
			this._blastSpawnFunction = parameters.blastSpawnFunction
		}
	}

	OnObjectCreationStage(index: number): void {
		if (index === this._turnToExplosion) {
			this.gameObject.scene.RemoveGameObjectsByFilter(
				r => this.gameObject == r.object
			)
			this.DamageTile(this.gameObject.position)

			for (let dir of this._pattern) {
				for (let i = 1; i <= this._range; ++i) {
					const pos = this.gameObject.position.Add(dir.MulScalar(i))
					const cellData = this._grid.object.GetCellData(
						new Vector2(pos.x, pos.y)
					)

					if (cellData == null) {
						this.DamageTile(pos)
						continue
					}

					let destructibleWall: SafeReference<DestructibleWall>[] = []
					let wall: SafeReference<Wall>[] = []

					for (let data of cellData) {
						const gameObject = data.ref.object
						destructibleWall = destructibleWall.concat(
							gameObject.GetComponents(
								DestructibleWall
							) as SafeReference<DestructibleWall>[]
						)
						wall = wall.concat(
							gameObject.GetComponents(Wall) as SafeReference<Wall>[]
						)
					}

					if (wall && wall.length > 0) {
						break
					}

					this.DamageTile(pos)

					if (destructibleWall && destructibleWall.length > 0) {
						break
					}
				}
			}
		}
	}

	private DamageTile(position: Vector2) {
		this._blastSpawnFunction(position)
		let cellData = this._grid.object.GetCellData(position.Clone())

		if (cellData == null) return

		for (let data of cellData) {
			let object = data.ref.object
			let isMoving = data.newPosition !== undefined && data.newPosition !== null

			if (object && !isMoving) {
				let healthComponent = object.GetComponents(
					HealthComponent
				)[0] as SafeReference<HealthComponent>
				if (healthComponent) {
					healthComponent.object.TakeDamage(this._damage)
				}
			}
		}
	}
}

export class BombControllerParameters extends ComponentParameters {
	damage: number
	range: number
	ticksToExplosion: number
	grid: SafeReference<BombermanGrid>
	blastSpawnFunction: Function
	constructor(
		grid: SafeReference<BombermanGrid>,
		blastSpawnFunction: Function,
		damage: number = 1,
		range: number = 1,
		ticksToExplosion: number = 3
	) {
		super()
		this.blastSpawnFunction = blastSpawnFunction
		this.grid = grid
		this.damage = damage
		this.range = range
		this.ticksToExplosion = ticksToExplosion
	}
}
