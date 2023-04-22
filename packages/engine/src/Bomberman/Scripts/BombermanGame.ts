import {
	StaticImageRenderComponent,
	StaticRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/StaticImageRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import {
	ControllerCreationData,
	GameEngine,
	GameEngineParameters,
	GameInfo,
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
	BombermanControllerCommand,
	BombermanControllerData,
} from './BombermanController'
import { IAsyncControllerBridge } from 'GameEngine/UserAIRuner/AsyncControllerBridge'
import { Scene } from 'GameEngine/Scene/Scene'
import { BodyAllData } from './MapData'
import { BombermanGrid, BombermanGridParameters } from './BombermanGrid'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { ComponentParameters } from 'GameEngine/BaseComponents/GameObjectComponent'

export class BombermanGame extends GameEngine {
	private _gridComponent: SafeReference<BombermanGrid>

	async Init(parameters: BombermanGameParameters): Promise<unknown> {
		parameters.sceneParameters.isGameEnd ??= (container): boolean => {
			let counter = 0
			for (let ref of container) {
				if (ref.object.GetComponents(ManBody).length > 0) {
					counter++
					if (counter > 1) return
				}
			}

			return true
		}

		await super.Init(parameters)

		await this.LoadAllImages([
			'./Resources/Grass.png',
			'./Resources/Wall.png',
			'./Resources/Blast.png',
			'./Resources/Metal.png',
			'./Resources/Bomb.png',
			'./Resources/BombRed.png',
			'./Resources/Man.png',
		])

		const map = parameters.map

		const height = map.field.length
		const width = map.field[0].length

		const gridObject = this.CreateGrid(
			new BombermanGridParameters(width, height)
		)
		//Force init grid
		this.scene.OnFinalize()
		this._gridComponent = gridObject.object.GetComponents(
			BombermanGrid
		)[0] as SafeReference<BombermanGrid>

		const shuffledSpawns = shuffle(map.spawns)

		if (parameters.map.spawns.length < parameters.controllersData.length) {
			throw Error('Spawn less then controllers')
		}

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				switch (map.field[y][x]) {
					case 1:
						this.CreateDestructibleWall(new Vector2(x, y))
						break
					case 2:
						this.CreateSimpleWall(new Vector2(x, y))
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
				this._gridComponent,
				(
					ref: SafeReference<IGameObject>,
					position: Vector2,
					damage: number,
					range: number,
					ticksToExplosion: number
				) => this.CreateBomb(ref, position, damage, range, ticksToExplosion)
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

	private RegisterObjectEventsToGrid(ref: SafeReference<IGameObject>) {
		ref.onHasInitiated.Subscribe(data =>
			this._gridComponent.object.TryRegisterObject(ref)
		)
		ref.onHasDestroyed.Subscribe(data =>
			this._gridComponent.object.TryUnregisterObject(ref)
		)
	}

	private CreateDestructibleWall(position: Vector2) {
		const ref = this.scene.CreateDefaultGameObject(position, [
			[
				new StaticImageRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					this.imageLoader.GetPng('./Resources/Wall.png'),
					0
				),
			],
			[new HealthComponent(), new HealthComponentParameters()],
			[new DestructibleWall(), new ComponentParameters()],
		])
		this.RegisterObjectEventsToGrid(ref)
	}

	private CreateBlast(position: Vector2) {
		this.scene.CreateDefaultGameObject(position, [
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

	private CreateSimpleWall(position: Vector2) {
		const ref = this.scene.CreateDefaultGameObject(position, [
			[
				new StaticImageRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					this.imageLoader.GetPng('./Resources/Metal.png'),
					0
				),
			],
			[new Wall(), new ComponentParameters()],
		])

		this.RegisterObjectEventsToGrid(ref)
	}

	private CreateBomb(
		creator: SafeReference<IGameObject>,
		position: Vector2,
		damage: number = 1,
		range: number = 1,
		ticksToExplosion: number = 3
	): SafeReference<IGameObject> {
		if (!this._gridComponent.object.CanCreateBomb(creator, position)) {
			return null
		}
		const ref = this.scene.CreateDefaultGameObject(position, [
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
					this._gridComponent,
					(position: Vector2) => this.CreateBlast(position),
					damage,
					range,
					ticksToExplosion
				),
			],
		])

		this.RegisterObjectEventsToGrid(ref)

		return ref
	}

	private CreateMan(position: Vector2, manBodyParameters: ManBodyParameters) {
		const ref = this.scene.CreateDefaultGameObject(position, [
			[
				new StaticImageRenderComponent(),
				new StaticRenderComponentParameters(
					new Vector2(1, 1),
					this.imageLoader.GetPng('./Resources/Man.png'),
					1
				),
			],
			[new ManBody(), manBodyParameters],
			[new HealthComponent(), new HealthComponentParameters()],
		])

		this.RegisterObjectEventsToGrid(ref)
	}

	private CreateGrid(
		parameters: BombermanGridParameters
	): SafeReference<IGameObject> {
		const grid = new BombermanGrid()
		return this.scene.CreateDefaultGameObject(new Vector2(), [
			[grid, parameters],
		])
	}

	public GetGameInfo(): BombermanGameInfo {
		const bodiesData: BodyAllData[] = []
		for (let ref of this.scene.GetReadonlyContainer()) {
			for (let body of ref.object.GetComponents(ManBody)) {
				bodiesData.push((body.object as ManBody).GetAllData())
			}
		}
		const gameInfo = super.GetGameInfo()
		return new BombermanGameInfo(
			gameInfo.currentTurnNumber,
			gameInfo.maxTurnIndex,
			gameInfo.isGameEnd,
			bodiesData
		)
	}
}

export class BombermanGameInfo extends GameInfo {
	private _bodiesData: BodyAllData[]

	public get bodiesData(): BodyAllData[] {
		return this._bodiesData
	}
	public set bodiesData(v: BodyAllData[]) {
		this._bodiesData = v
	}

	constructor(
		currentTurnNumber: number,
		maxTurnIndex: number,
		isGameEnd: boolean,
		bodiesData: BodyAllData[]
	) {
		super(currentTurnNumber, maxTurnIndex, isGameEnd)
		this._bodiesData = bodiesData
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
		map: BombermanMap,
		controllers: ControllerCreationData[],
		sceneParameters: SceneParameters,
		scene?: Scene,
		shouldLoadImage: boolean = true,
		imageLoader?: ImageLoader
	) {
		super(controllers, sceneParameters, scene, shouldLoadImage, imageLoader)
		this.map = map
	}
}
