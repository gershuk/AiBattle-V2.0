import {
	DiscreteColliderSystem,
	DiscreteColliderSystemParameters,
} from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteColliderSystem'
import {
	DiscreteMovementComponent,
	DiscreteMovementComponentParameters,
} from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteMovementComponent'
import {
	StaticRenderComponent,
	StaticRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/StaticRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { GameEngine, GameEngineParameters } from 'GameEngine/GameEngine'
import { GameObject } from 'GameEngine/GameObject/GameObject'
import { ImageLoader } from 'GameEngine/ResourceStorage/ImageLoader'
import { SceneParameters } from 'GameEngine/Scene/IScene'
import { Scene } from 'GameEngine/Scene/Scene'

export class BombermanGame extends GameEngine {
	private _map: BombermanMap

	async Init(parameters: BombermanGameParameters) {
		super.Init(parameters)
		if (parameters instanceof BombermanGameParameters) {
			this._map = parameters.map

			const height = this._map.field.length
			const width = this._map.field[0].length
			const colliderSystem = this.CreateColliderSystem(width, height)

			for (let y = 0; y < height; ++y) {
				for (let x = 0; x < width; ++x) {
					switch (this._map.field[y][x]) {
						case 1:
							await this.CreateWall(new Vector2(x, y), colliderSystem)
							break
						case 2:
							await this.CreateMetal(new Vector2(x, y), colliderSystem)
							break
						default:
							break
					}
					await this.CreateGrass(new Vector2(x, y))
				}
			}
		} else {
			throw new Error(
				'Wrong parameters type. Expected SimpleDemoEngineParameters.'
			)
		}
	}

	private async CreateGrass(position: Vector2) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
			new StaticRenderComponent(),
			new StaticRenderComponentParameters(
				new Vector2(1, 1),
				await this.imageLoader.LoadPng('./Resources/Grass.png'),
				-1
			),
		])
	}

	private async CreateWall(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem
	) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(
			position,
			gameObject,
			[
				new StaticRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					await this.imageLoader.LoadPng('./Resources/Wall.png'),
					0
				),
			],
			[
				new DiscreteMovementComponent(),
				new DiscreteMovementComponentParameters(discreteColliderSystem),
			]
		)
	}

	private async CreateMetal(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem
	) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(
			position,
			gameObject,
			[
				new StaticRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					await this.imageLoader.LoadPng('./Resources/Metal.png'),
					0
				),
			],
			[
				new DiscreteMovementComponent(),
				new DiscreteMovementComponentParameters(discreteColliderSystem),
			]
		)
	}

	private CreateColliderSystem(
		width: number,
		height: number
	): DiscreteColliderSystem {
		const gameObject = new GameObject(new Vector2())
		const discreteColliderSystem = new DiscreteColliderSystem()
		this.scene.AddGameObject(new Vector2(0, 0), gameObject, [
			discreteColliderSystem,
			new DiscreteColliderSystemParameters(width, height),
		])
		return discreteColliderSystem
	}
}

export class BombermanMap {
	field: number[][]
	spawns: Vector2[]

	constructor(filed: number[][], spawns: Vector2[]) {
		this.field = filed
		this.spawns = spawns
	}
}

export class BombermanGameParameters extends GameEngineParameters {
	map: BombermanMap
	constructor(
		sceneParameters: SceneParameters,
		map: BombermanMap,
		imageLoader?: ImageLoader
	) {
		super(sceneParameters, imageLoader)
		this.map = map
	}
}
