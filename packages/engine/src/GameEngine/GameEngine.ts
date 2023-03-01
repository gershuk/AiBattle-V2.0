import { GameObjectComponent } from './BaseComponents/GameObjectComponent'
import { Vector2 } from './BaseComponents/Vector2'
import { Message } from './MessageBroker/Message'
import { ImageLoader } from './ResourceStorage/ImageLoader'
import { IScene, PlayModeParameters, SceneParameters } from './Scene/IScene'
import { Scene } from './Scene/Scene'

export interface IGameEngine {
	get renderOffset(): Vector2
	set renderOffset(v: Vector2)

	get tileSizeScale(): Number
	set tileSizeScale(v: Number)

	get playModeParameters(): PlayModeParameters

	Init(parameters: GameEngineParameters): void

	Start(): void

	RenderFrame(): void

	DoNextTurn(): void

	StopAutoTurn(): void

	StartAutoTurn(): void

	LoadImage(path: string): Promise<HTMLImageElement>

	SendMessage(
		component: GameObjectComponent,
		receiverUuid: string,
		data: any
	): number

	GetMessage(component: GameObjectComponent): [number, Message?]
}

export class GameEngine implements IGameEngine {
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

	public get renderOffset(): Vector2 {
		return this.scene.renderOffset
	}

	public set renderOffset(v: Vector2) {
		this.scene.renderOffset = v
	}

	public get tileSizeScale(): Number {
		return this.scene.tileSizeScale
	}

	public set tileSizeScale(v: Number) {
		this.scene.tileSizeScale = v
	}

	public get playModeParameters(): PlayModeParameters {
		return structuredClone(this.scene.playModeParameters)
	}

	public async Init(parameters: GameEngineParameters) {
		this.scene = parameters.scene ?? new Scene()
		this.scene.Init(parameters.sceneParameters)
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

	public LoadImage(path: string): Promise<HTMLImageElement> {
		return this.imageLoader.LoadPng(path)
	}

	public SendMessage(
		component: GameObjectComponent,
		receiverUuid: string,
		data: any
	): number {
		return this.scene.messageBroker.SendMessage(component, receiverUuid, data)
	}

	public GetMessage(component: GameObjectComponent): [number, Message?] {
		return this.scene.messageBroker.GetMessage(component)
	}
}

export class GameEngineParameters {
	scene: IScene | undefined
	sceneParameters: SceneParameters
	imageLoader?: ImageLoader

	constructor(
		sceneParameters: SceneParameters,
		imageLoader?: ImageLoader,
		scene?: Scene
	) {
		this.sceneParameters = sceneParameters
		this.imageLoader = imageLoader ?? new ImageLoader()
		this.scene = scene
	}
}
