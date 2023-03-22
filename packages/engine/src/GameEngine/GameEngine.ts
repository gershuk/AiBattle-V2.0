import { SlimEvent } from 'Utilities'
import { GameObjectComponent } from './BaseComponents/GameObjectComponent'
import { Vector2 } from './BaseComponents/Vector2'
import { Message } from './MessageBroker/Message'
import { ImageLoader } from './ResourceStorage/ImageLoader'
import { IScene, PlayModeParameters, SceneParameters } from './Scene/IScene'
import { Scene } from './Scene/Scene'
import {
	AbstractControllerCommand,
	AbstractControllerData,
} from './UserAIRuner/AbstractController'
import { IAsyncControllerBridge } from './UserAIRuner/AsyncControllerBridge'
import { WorkerBridge } from './UserAIRuner/WorkerBridge'

export interface IGameEngine {
	get OnSceneStart(): SlimEvent<void>

	get OnTurnStart(): SlimEvent<void>

	get OnTurnEnd(): SlimEvent<void>

	get OnGameEnd(): SlimEvent<void>

	get renderOffset(): Vector2
	set renderOffset(v: Vector2)

	get tileSizeScale(): Number
	set tileSizeScale(v: Number)

	get playModeParameters(): PlayModeParameters

	get shouldLoadImage(): boolean

	Init(parameters: GameEngineParameters): Promise<unknown>

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

	CreateWorkerBridge<
		TInitData extends AbstractControllerData,
		TTurnData extends AbstractControllerData,
		TCommand extends AbstractControllerCommand
	>(
		controllerData: ControllerCreationData
	): IAsyncControllerBridge<TInitData, TTurnData, TCommand>

	GetOrCreateControllerFromData<
		TInitData extends AbstractControllerData,
		TTurnData extends AbstractControllerData,
		TCommand extends AbstractControllerCommand
	>(
		controllerData: ControllerCreationData
	): IAsyncControllerBridge<
		AbstractControllerData,
		AbstractControllerData,
		AbstractControllerCommand
	>

	LoadAllImages(imagesPath: string[]): Promise<HTMLImageElement[]>
}

export class GameEngine implements IGameEngine {
	private _shouldLoadImage: boolean
	private _scene: IScene
	private _imageLoader: ImageLoader

	get OnSceneStart(): SlimEvent<void> {
		return this.scene.OnSceneStart
	}
	get OnTurnStart(): SlimEvent<void> {
		return this.scene.OnTurnStart
	}
	get OnTurnEnd(): SlimEvent<void> {
		return this.scene.OnTurnEnd
	}
	get OnGameEnd(): SlimEvent<void> {
		return this.scene.OnGameEnd
	}

	public get shouldLoadImage(): boolean {
		return this._shouldLoadImage
	}
	protected set shouldLoadImage(v: boolean) {
		this._shouldLoadImage = v
	}

	protected get scene(): IScene {
		return this._scene
	}

	protected set scene(v: IScene) {
		this._scene = v
	}

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

	public LoadAllImages(imagesPath: string[]): Promise<HTMLImageElement[]> {
		if (this.shouldLoadImage) return this.imageLoader.LoadPngs(imagesPath)
	}

	public async Init(parameters: GameEngineParameters): Promise<unknown> {
		this.scene = parameters.scene ?? new Scene()
		this.scene.Init(parameters.sceneParameters)
		this.imageLoader = parameters.imageLoader
		this.shouldLoadImage = parameters.shouldLoadImages
		return Promise.resolve()
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

	GetOrCreateControllerFromData<
		TInitData extends AbstractControllerData,
		TTurnData extends AbstractControllerData,
		TCommand extends AbstractControllerCommand
	>(
		controllerData: ControllerCreationData
	): IAsyncControllerBridge<
		AbstractControllerData,
		AbstractControllerData,
		AbstractControllerCommand
	> {
		return (
			controllerData.controllerBridgeInstance ??
			this.CreateWorkerBridge<TInitData, TTurnData, TCommand>(controllerData)
		)
	}

	CreateWorkerBridge<
		TInitData extends AbstractControllerData,
		TTurnData extends AbstractControllerData,
		TCommand extends AbstractControllerCommand
	>(
		controllerData: ControllerCreationData
	): IAsyncControllerBridge<TInitData, TTurnData, TCommand> {
		return new WorkerBridge<TInitData, TTurnData, TCommand>(
			controllerData.text,
			controllerData.uuid
		)
	}
}

export class ControllerCreationData {
	text: string
	uuid: string | undefined
	controllerBridgeInstance:
		| IAsyncControllerBridge<
				AbstractControllerData,
				AbstractControllerData,
				AbstractControllerCommand
		  >
		| undefined

	constructor(
		text: string,
		uuid?: string,
		controllerBridgeInstance?: IAsyncControllerBridge<
			AbstractControllerData,
			AbstractControllerData,
			AbstractControllerCommand
		>
	) {
		this.text = text
		this.uuid = uuid
		this.controllerBridgeInstance = controllerBridgeInstance
	}
}

export class GameEngineParameters {
	scene: IScene | undefined
	sceneParameters: SceneParameters
	imageLoader?: ImageLoader
	controllersData: ControllerCreationData[]
	shouldLoadImages: boolean
	constructor(
		controllers: ControllerCreationData[],
		sceneParameters: SceneParameters,
		scene?: Scene,
		shouldLoadImages: boolean = true,
		imageLoader?: ImageLoader
	) {
		this.sceneParameters = sceneParameters
		this.controllersData = controllers
		this.imageLoader = imageLoader ?? new ImageLoader()
		this.scene = scene
		this.shouldLoadImages = shouldLoadImages
	}
}
