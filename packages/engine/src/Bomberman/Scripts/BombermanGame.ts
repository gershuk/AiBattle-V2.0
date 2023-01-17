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
import { shuffle } from 'Utilities/ShuffleArray'
import { ManBody, ManBodyParameters } from './ManBody'
import { BombController, BombControllerParameters } from './BombController'
import { Blast } from './Blast'
import { HealthComponent, HealthComponentParameters } from './Health'
import { Wall } from './Wall'
import { Metal } from './Metal'
import {
	AnimationFrame,
	AnimationRenderComponent,
	AnimationRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/AnimationRenderComponent'

export class BombermanGame extends GameEngine {
	private _map: BombermanMap

	async Init(parameters: BombermanGameParameters) {
		super.Init(parameters)
		if (parameters instanceof BombermanGameParameters) {
			this._map = parameters.map

			const height = this._map.field.length
			const width = this._map.field[0].length
			const colliderSystem = this.CreateColliderSystem(width, height)
			const shuffledSpawns = shuffle(this._map.spawns)

			if (parameters.map.spawns.length < parameters.controllers.length) {
				throw Error('Spawn less then controllers')
			}

			//ToDo: image loading section
			await this.imageLoader.LoadPng('./Resources/Blast.png')

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
			let i = 0
			for (let controller of parameters.controllers) {
				await this.CreateMan(shuffledSpawns[i], colliderSystem, controller)
				++i
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
			[
				new StaticRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					await this.imageLoader.LoadPng('./Resources/Grass.png'),
					-1
				),
			],
		])
	}

	private async CreateWall(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem
	) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
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
			],
			[new HealthComponent(), new HealthComponentParameters()],
			[new Wall()],
		])
	}

	private async CreateBlast(position: Vector2) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
			[
				new StaticRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					await this.imageLoader.LoadPng('./Resources/Blast.png'),
					3
				),
			],
			[new Blast()],
		])
	}

	private async CreateMetal(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem
	) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
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
			],
			[new Metal()],
		])
	}

	private async CreateBomb(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem,
		damage: number = 1,
		range: number = 1,
		ticksToExplosion: number = 3
	): Promise<GameObject> {
		if (
			!discreteColliderSystem.CanInit(position.x, position.y) &&
			discreteColliderSystem.GetCellData(position.x, position.y).receiver
		) {
			return null
		}

		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
			[
				new AnimationRenderComponent(),
				new AnimationRenderComponentParameters([
					new AnimationFrame(
						new StaticRenderComponentParameters(
							new Vector2(1, 1),
							await this.imageLoader.LoadPng('./Resources/Bomb.png'),
							0
						),
						0.5
					),
					new AnimationFrame(
						new StaticRenderComponentParameters(
							new Vector2(1, 1),
							await this.imageLoader.LoadPng('./Resources/BombRed.png'),
							0
						),
						1
					),
				]),
			],
			[
				new BombController(),
				new BombControllerParameters(
					discreteColliderSystem,
					(position: Vector2) => this.CreateBlast(position),
					damage,
					range,
					ticksToExplosion
				),
			],
		])
		return gameObject
	}

	private async CreateMan(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem,
		controllerText: string
	) {
		const gameObject = new GameObject(new Vector2())
		this.scene.AddGameObject(position, gameObject, [
			[
				new StaticRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					await this.imageLoader.LoadPng('./Resources/Man.png'),
					1
				),
			],
			[
				new DiscreteMovementComponent(),
				new DiscreteMovementComponentParameters(discreteColliderSystem),
			],
			[
				new ManBody(),
				new ManBodyParameters(
					controllerText,
					discreteColliderSystem,
					async (
						position: Vector2,
						damage: number,
						range: number,
						ticksToExplosion: number
					) =>
						await this.CreateBomb(
							position,
							discreteColliderSystem,
							damage,
							range,
							ticksToExplosion
						)
				),
			],
			[new HealthComponent(), new HealthComponentParameters()],
		])
	}

	private CreateColliderSystem(
		width: number,
		height: number
	): DiscreteColliderSystem {
		const gameObject = new GameObject(new Vector2())
		const discreteColliderSystem = new DiscreteColliderSystem()
		this.scene.AddGameObject(new Vector2(0, 0), gameObject, [
			[
				discreteColliderSystem,
				new DiscreteColliderSystemParameters(width, height),
			],
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
	controllers: string[]
	constructor(
		sceneParameters: SceneParameters,
		map: BombermanMap,
		controllers: string[],
		imageLoader?: ImageLoader
	) {
		super(sceneParameters, imageLoader)
		this.map = map
		this.controllers = controllers
	}
}
