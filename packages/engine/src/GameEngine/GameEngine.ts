import { AbstractObjectComponent } from './BaseComponents/AbstractObjectComponent'
import { Vector2 } from './BaseComponents/Vector2'
import { Message } from './MessageBroker/Message'
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

	LoadImage(path: string): Promise<HTMLImageElement>

	SendMessage(
		component: AbstractObjectComponent,
		receiverUuid: string,
		data: any
	): number

	GetMessage(component: AbstractObjectComponent): [number, Message?]
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

	// constructor(parameters: GameEngineParameters) {
	// 	this.Init(parameters)
	// }

	public async Init(parameters: GameEngineParameters) {
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

	public LoadImage(path: string): Promise<HTMLImageElement> {
		return this.imageLoader.LoadPng(path)
	}

	public SendMessage(
		component: AbstractObjectComponent,
		receiverUuid: string,
		data: any
	): number {
		return this.scene.messageBroker.SendMessage(component, receiverUuid, data)
	}

	public GetMessage(component: AbstractObjectComponent): [number, Message?] {
		return this.scene.messageBroker.GetMessage(component)
	}
}

export class GameEngineParameters {
	sceneParameters: SceneParameters
	imageLoader?: ImageLoader

	constructor(sceneParameters: SceneParameters, imageLoader?: ImageLoader) {
		this.sceneParameters = sceneParameters
		this.imageLoader = imageLoader ?? new ImageLoader()
	}
}
