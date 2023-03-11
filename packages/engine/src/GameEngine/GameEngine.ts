import { GameObjectComponent } from './BaseComponents/GameObjectComponent'
import { Vector2 } from './BaseComponents/Vector2'
import { Message } from './MessageBroker/Message'
import { ImageLoader } from './ResourceStorage/ImageLoader'
import { IScene, PlayModeParameters, SceneParameters } from './Scene/IScene'
import { Scene } from './Scene/Scene'
import {
	AbstractController,
	AbstractControllerCommand,
	AbstractControllerData,
	RemoteController,
} from './UserAIRuner/AbstractController'
import { LoadControllerFromString } from './UserAIRuner/SafeEval'

export interface IGameEngine {
	get renderOffset(): Vector2
	set renderOffset(v: Vector2)

	get tileSizeScale(): Number
	set tileSizeScale(v: Number)

	get playModeParameters(): PlayModeParameters

	Init(parameters: GameEngineParameters): void

	Start(): Promise<unknown>

	RenderFrame(): void

	DoNextTurn(): Promise<unknown>

	StopAutoTurn(): void

	StartAutoTurn(): void

	LoadImage(path: string): Promise<HTMLImageElement>

	SendMessage(
		component: GameObjectComponent,
		receiverUuid: string,
		data: any
	): number

	GetMessage(component: GameObjectComponent): [number, Message?]

	CreateController<
		TInitData extends AbstractControllerData,
		TTurnData extends AbstractControllerData,
		TCommand extends AbstractControllerCommand,
		TController extends AbstractController<TInitData, TTurnData, TCommand>
	>(
		controllerData: ControllerCreationData
	): TController | RemoteController<TInitData, TTurnData, TCommand>
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

	public async Start(): Promise<unknown> {
		await this.scene?.Start()
		return Promise.resolve()
	}

	public RenderFrame(): void {
		this.scene?.RenderFrame()
	}

	public async DoNextTurn(): Promise<unknown> {
		await this.scene?.DoNextTurn()
		return Promise.resolve()
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

	CreateController<
		TInitData extends AbstractControllerData,
		TTurnData extends AbstractControllerData,
		TCommand extends AbstractControllerCommand,
		TController extends AbstractController<TInitData, TTurnData, TCommand>
	>(
		controllerData: ControllerCreationData
	): TController | RemoteController<TInitData, TTurnData, TCommand> {
		return controllerData.isRemote
			? new RemoteController<TInitData, TTurnData, TCommand>()
			: LoadControllerFromString<TInitData, TTurnData, TCommand, TController>(
					controllerData.text
			  )
	}
}

export class ControllerCreationData {
	text: string
	uuid: string | undefined
	isRemote: boolean

	constructor(text: string, uuid?: string, isRemote: boolean = false) {
		this.text = text
		this.uuid = uuid
		this.isRemote = isRemote
	}
}

export class GameEngineParameters {
	scene: IScene | undefined
	sceneParameters: SceneParameters
	imageLoader?: ImageLoader
	controllers: ControllerCreationData[]
	constructor(
		sceneParameters: SceneParameters,
		controllers: ControllerCreationData[],
		imageLoader?: ImageLoader,
		scene?: Scene
	) {
		this.sceneParameters = sceneParameters
		this.controllers = controllers
		this.imageLoader = imageLoader ?? new ImageLoader()
		this.scene = scene
	}
}
