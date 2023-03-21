import {
	DiscreteColliderSystem,
	DiscreteColliderSystemParameters,
} from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteColliderSystem'
import {
	DiscreteMovementComponent,
	DiscreteMovementComponentParameters,
} from 'GameEngine/BaseComponents/DiscreteColliderSystem/DiscreteMovementComponent'
import {
	StaticImageRenderComponent,
	StaticRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/StaticImageRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import {
	ControllerCreationData,
	GameEngine,
	GameEngineParameters,
} from 'GameEngine/GameEngine'
import { GameObject } from 'GameEngine/GameObject/GameObject'
import { ImageLoader } from 'GameEngine/ResourceStorage/ImageLoader'
import { SceneParameters } from 'GameEngine/Scene/IScene'
import { shuffle } from 'Utilities/ShuffleArray'
import { ManBody, ManBodyParameters } from './ManBody'
import { BombController, BombControllerParameters } from './BombController'
import { BlastRender } from './BlastRender'
import { HealthComponent, HealthComponentParameters } from './Health'
import { DestructibleWall } from './DestructibleWall'
import { Wall } from './Wall'
import {
	AnimationFrame,
	AnimationRenderComponent,
	AnimationRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/AnimationRenderComponent'
import {
	BombermanController,
	BombermanControllerCommand,
	BombermanControllerData,
} from './BombermanController'
import { IAsyncControllerBridge } from 'GameEngine/UserAIRuner/AsyncControllerBridge'

export class BombermanGame extends GameEngine {
	private _map: BombermanMap

	async Init(parameters: BombermanGameParameters): Promise<unknown> {
		parameters.sceneParameters.isGameEnd ??= (gameObjectRefs): boolean => {
			for (let ref of gameObjectRefs) {
				if (ref.object.GetComponents(ManBody).length > 0) return false
			}

			return true
		}

		super.Init(parameters)

		await this.imageLoader.LoadPngs([
			'./Resources/Grass.png',
			'./Resources/Wall.png',
			'./Resources/Blast.png',
			'./Resources/Metal.png',
			'./Resources/Bomb.png',
			'./Resources/BombRed.png',
			'./Resources/Man.png',
		])

		this._map = parameters.map

		const height = this._map.field.length
		const width = this._map.field[0].length

		const colliderSystem = this.CreateColliderSystem(width, height)

		const shuffledSpawns = shuffle(this._map.spawns)

		if (parameters.map.spawns.length < parameters.controllersData.length) {
			throw Error('Spawn less then controllers')
		}

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				switch (this._map.field[y][x]) {
					case 1:
						this.CreateDestructibleWall(new Vector2(x, y), colliderSystem)
						break
					case 2:
						this.CreateSimpleWall(new Vector2(x, y), colliderSystem)
						break
					default:
						break
				}
				this.CreateGrass(new Vector2(x, y))
			}
		}

		let i = 0
		for (let controllerData of parameters.controllersData) {
			const manBodyParameters = new ManBodyParameters(
				this.GetOrCreateControllerFromData(
					controllerData
				) as IAsyncControllerBridge<
					BombermanControllerData,
					BombermanControllerData,
					BombermanControllerCommand
				>,
				colliderSystem,
				(position: Vector2, damage: number, range: number, ticksToExplosion) =>
					this.CreateBomb(
						position,
						colliderSystem,
						damage,
						range,
						ticksToExplosion
					)
			)
			manBodyParameters.initTimeout = this.scene.initTimeout
			manBodyParameters.commandCalcTimeout = this.scene.commandCalcTimeout

			this.CreateMan(shuffledSpawns[i], manBodyParameters)

			++i
		}
		return Promise.resolve()
	}

	private CreateGrass(position: Vector2) {
		const gameObject = new GameObject()
		this.scene.AddGameObject(position, gameObject, [
			[
				new StaticImageRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					this.imageLoader.GetPng('./Resources/Grass.png'),
					-1
				),
			],
		])
	}

	private CreateDestructibleWall(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem
	) {
		const gameObject = new GameObject()
		this.scene.AddGameObject(position, gameObject, [
			[
				new StaticImageRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					this.imageLoader.GetPng('./Resources/Wall.png'),
					0
				),
			],
			[
				new DiscreteMovementComponent(),
				new DiscreteMovementComponentParameters(discreteColliderSystem),
			],
			[new HealthComponent(), new HealthComponentParameters()],
			[new DestructibleWall()],
		])
	}

	private CreateBlast(position: Vector2) {
		const gameObject = new GameObject()
		this.scene.AddGameObject(position, gameObject, [
			[
				new BlastRender(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					this.imageLoader.GetPng('./Resources/Blast.png'),
					3
				),
			],
		])
	}

	private CreateSimpleWall(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem
	) {
		const gameObject = new GameObject()
		this.scene.AddGameObject(position, gameObject, [
			[
				new StaticImageRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					this.imageLoader.GetPng('./Resources/Metal.png'),
					0
				),
			],
			[
				new DiscreteMovementComponent(),
				new DiscreteMovementComponentParameters(discreteColliderSystem),
			],
			[new Wall()],
		])
	}

	private CreateBomb(
		position: Vector2,
		discreteColliderSystem: DiscreteColliderSystem,
		damage: number = 1,
		range: number = 1,
		ticksToExplosion: number = 3
	): GameObject {
		if (
			!discreteColliderSystem.CanInit(position.x, position.y) &&
			discreteColliderSystem.GetCellData(position.x, position.y).receiver
		) {
			return null
		}
		const gameObject = new GameObject()
		this.scene.AddGameObject(position, gameObject, [
			[
				new AnimationRenderComponent(),
				new AnimationRenderComponentParameters([
					new AnimationFrame(
						new StaticRenderComponentParameters(
							new Vector2(1, 1),
							this.imageLoader.GetPng('./Resources/Bomb.png'),
							0
						),
						0.5
					),
					new AnimationFrame(
						new StaticRenderComponentParameters(
							new Vector2(1, 1),
							this.imageLoader.GetPng('./Resources/BombRed.png'),
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

	private CreateMan(position: Vector2, manBodyParameters: ManBodyParameters) {
		const gameObject = new GameObject()
		this.scene.AddGameObject(position, gameObject, [
			[
				new StaticImageRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					this.imageLoader.GetPng('./Resources/Man.png'),
					1
				),
			],
			[
				new DiscreteMovementComponent(),
				new DiscreteMovementComponentParameters(
					manBodyParameters.discreteColliderSystem
				),
			],
			[new ManBody(), manBodyParameters],
			[new HealthComponent(), new HealthComponentParameters()],
		])
	}

	private CreateColliderSystem(
		width: number,
		height: number
	): DiscreteColliderSystem {
		const gameObject = new GameObject()
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
	constructor(
		sceneParameters: SceneParameters,
		map: BombermanMap,
		controllers: ControllerCreationData[],
		imageLoader?: ImageLoader
	) {
		super(sceneParameters, controllers, imageLoader)
		this.map = map
	}
}
