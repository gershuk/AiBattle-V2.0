import { Vector2 } from './BaseComponents/Vector2'
import { ImageLoader } from './ResourceStorage/ImageLoader'
import { IScene, SceneParameters } from './Scene/IScene'
import { Scene } from './Scene/Scene'

export interface IGameEngine {
	get renderOffset(): Vector2
	set renderOffset(v: Vector2)

	Init(parameters: GameEngineParameters): void

	Start(): void

	RenderFrame(): void

	DoNextTurn(): void

	StopAutoTurn(): void

	StartAutoTurn(): void

	LoadImage(path: string): HTMLImageElement | undefined
}

export class GameEngine implements IGameEngine {
	public get renderOffset(): Vector2 {
		return this.scene.renderOffset
	}
	public set renderOffset(v: Vector2) {
		this.scene.renderOffset = v
	}

	private _scene: IScene
	protected get scene(): IScene {
		return this._scene
	}
	protected set scene(v: IScene) {
		this._scene = v
	}

	private _imageLoader: ImageLoader
	protected get imageLoader(): ImageLoader {
		return this._imageLoader
	}
	protected set imageLoader(v: ImageLoader) {
		this._imageLoader = v
	}

	constructor(parameters: GameEngineParameters) {
		this.Init(parameters)
	}

	public Init(parameters: GameEngineParameters): void {
		this.scene = new Scene(parameters.sceneParameters)
		this.imageLoader = parameters.imageLoader
	}

	public Start(): void {
		this.scene?.Start()
	}

	public RenderFrame(): void {
		this.scene?.RenderFrame()
	}

	public DoNextTurn(): void {
		this.scene?.DoNextTurn()
	}

	public StopAutoTurn(): void {
		this.scene?.StopAutoTurn()
	}

	public StartAutoTurn(): void {
		this.scene?.StartAutoTurn()
	}

	public LoadImage(path: string): HTMLImageElement | undefined {
		return this.imageLoader?.LoadPng(path)
	}
}

export class GameEngineParameters {
	sceneParameters: SceneParameters
	imageLoader?: ImageLoader

	constructor(sceneParameters: SceneParameters, imageLoader?: ImageLoader) {
		this.sceneParameters = sceneParameters
		this.imageLoader = imageLoader
	}
}
