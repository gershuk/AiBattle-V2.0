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
	constructor(parameters: BombermanGameParameters) {
		super(parameters)
	}

	Init(parameters: GameEngineParameters): void {
		super.Init(parameters)

		if (parameters instanceof BombermanGameParameters) {
			this._map = parameters.map
			const height = this._map.field.length
			const width = this._map.field[0].length
			for (let y = 0; y < height; ++y) {
				for (let x = 0; x < width; ++x) {
					switch (this._map.field[y][x]) {
						case 0:
							this.CreateGrass(new Vector2(x, y))
							break
						case 1:
							this.CreateWall(new Vector2(x, y))
							break
						case 2:
							this.CreateMetal(new Vector2(x, y))
							break
						default:
							break
					}
				}
			}
		} else {
			throw new Error(
				'Wrong parameters type. Expected SimpleDemoEngineParameters.'
			)
		}
	}

	private CreateGrass(position: Vector2) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
			new StaticRenderComponent(),
			new StaticRenderComponentParameters(
				new Vector2(1, 1),
				this.imageLoader.LoadPng('./Resources/Grass.png'),
				-1
			),
		])
	}

	private CreateWall(position: Vector2) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
			new StaticRenderComponent(),
			new StaticRenderComponentParameters(
				new Vector2(1, 1),
				this.imageLoader.LoadPng('./Resources/Wall.png'),
				0
			),
		])
	}

	private CreateMetal(position: Vector2) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
			new StaticRenderComponent(),
			new StaticRenderComponentParameters(
				new Vector2(1, 1),
				this.imageLoader.LoadPng('./Resources/Metal.png'),
				0
			),
		])
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
