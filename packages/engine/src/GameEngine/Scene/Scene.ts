import {
	GameObjectComponent,
	ComponentParameters,
} from '../BaseComponents/GameObjectComponent'
import { GameObject } from '../GameObject/GameObject'
import { IScene, PlayModeParameters, SceneParameters } from './IScene'
import { Vector2 } from '../BaseComponents/Vector2'
import { MessageBroker } from 'GameEngine/MessageBroker/MessageBroker'
import { IMessageBroker } from 'GameEngine/MessageBroker/IMessageBroker'
import { AbstractRenderComponent } from 'GameEngine/BaseComponents/RenderComponents/AbstractRenderComponent'
import { Delay } from 'Utilities/Delay'

enum SceneState {
	Init,
	Starting,
	ReadyToNextTurn,
	NextTurn,
	Animation,
}

export class Scene implements IScene {
	private _tileSizeScale: number
	private _gameObjects: GameObject[]
	private _turnIndex: number
	private _maxTurnIndex: number
	private _autoTurnTime: number
	private _autoTurnTimerId?: number
	private _state: SceneState
	private _animTicksCount: number
	private _animTicksTime: number
	private _canvas: HTMLCanvasElement

	private _playModeParameters: PlayModeParameters
	public get playModeParameters(): PlayModeParameters {
		return this._playModeParameters
	}
	protected set playModeParameters(v: PlayModeParameters) {
		this._playModeParameters = v
	}

	private _messageBroker: IMessageBroker
	public get messageBroker(): IMessageBroker {
		return this._messageBroker
	}
	private set messageBroker(v: IMessageBroker) {
		this._messageBroker = v
	}

	private _mousePositionOnCanvas: Vector2
	public get mousePositionOnCanvas(): Vector2 {
		return this._mousePositionOnCanvas
	}
	protected set mousePositionOnCanvas(v: Vector2) {
		this._mousePositionOnCanvas = v
	}

	private _renderOffset: Vector2
	public get renderOffset(): Vector2 {
		return this._renderOffset
	}
	public set renderOffset(v: Vector2) {
		this._renderOffset = v
	}

	protected set gameObjects(gameObjects: GameObject[]) {
		this._gameObjects = gameObjects
	}

	public get gameObjects(): GameObject[] {
		return this._gameObjects
	}

	public set turnIndex(turnIndex: number) {
		if (turnIndex < 0) throw new Error('turnIndex < 0')
		this._turnIndex = turnIndex
	}

	public get turnIndex(): number {
		return this._turnIndex
	}

	public set maxTurnIndex(maxTurnIndex: number) {
		if (maxTurnIndex < 1) throw new Error('maxTurnIndex < 1')
		this._maxTurnIndex = maxTurnIndex
	}

	public get maxTurnIndex(): number {
		return this._maxTurnIndex
	}

	protected set state(state: SceneState) {
		this._state = state
	}

	public get state(): SceneState {
		return this._state
	}

	public set animTicksCount(animTicksCount: number) {
		if (animTicksCount < 1) throw new Error('animTicksCount < 1')
		this._animTicksCount = animTicksCount
	}

	public get animTicksCount(): number {
		return this._animTicksCount
	}

	public set animTicksTime(animTicksTime: number) {
		if (animTicksTime < 0) throw new Error('animTicksTime < 0')
		this._animTicksTime = animTicksTime
	}

	public get animTicksTime(): number {
		return this._animTicksTime
	}

	public set autoTurnTime(autoTurnTime: number) {
		if (autoTurnTime < 1) throw new Error('autoTurnTime < 1')
		this._autoTurnTime = autoTurnTime
	}

	public get autoTurnTime(): number {
		return this._autoTurnTime
	}

	public set autoTurnTimerId(autoTurnTimerId: number | undefined) {
		this._autoTurnTimerId = autoTurnTimerId
	}

	public get autoTurnTimerId(): number | undefined {
		return this._autoTurnTimerId
	}

	public get canvas(): HTMLCanvasElement {
		return this._canvas
	}

	public set canvas(canvas: HTMLCanvasElement) {
		this._canvas = canvas
	}

	get tileSizeScale(): number {
		return this._tileSizeScale
	}

	set tileSizeScale(v: number) {
		this._tileSizeScale = v
		if (this.state && this.state !== SceneState.Starting) this.RenderFrame()
	}

	Init(parameters: SceneParameters): void {
		if (this.autoTurnTimerId) this.StopAutoTurn()

		this.messageBroker = new MessageBroker()

		this.maxTurnIndex = parameters.maxTurnIndex
		this.autoTurnTime = parameters.autoTurnTime
		this.animTicksCount = parameters.animTicksCount
		this.animTicksTime = parameters.animTicksTime
		this.canvas = parameters.canvas
		this.tileSizeScale = parameters.tileSizeScale

		this.gameObjects = new Array<GameObject>()
		this.renderOffset = new Vector2(0, 0)

		this.state = SceneState.Init

		this.mousePositionOnCanvas = new Vector2()
		this.canvas.addEventListener('mousemove', event => {
			const rect = (
				event.currentTarget as HTMLCanvasElement
			).getBoundingClientRect()
			const x = event.clientX - rect.left
			const y = event.clientY - rect.top
			this.mousePositionOnCanvas.SetXY(x, y)
		})

		this.playModeParameters = parameters.playModeParameters
	}

	public AddGameObject<T extends GameObject>(
		position: Vector2,
		gameObject: T,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string
	): void {
		this._gameObjects.push(gameObject)
		gameObject.Init(position, this, newComponents, id)
	}

	public AddGameObjects<T extends GameObject>(
		gameObjectInits: [
			Vector2,
			T,
			[GameObjectComponent, ComponentParameters?][]
		][]
	): void {
		for (let gameObjectInit of gameObjectInits)
			this.AddGameObject(
				gameObjectInit[0],
				gameObjectInit[1],
				gameObjectInit[2]
			)
	}

	public GetGameObjectsByFilter(
		filter: (g: GameObject) => boolean
	): GameObject[] {
		return this._gameObjects.filter(filter)
	}

	public RemoveGameObjectsByFilter(filter: (g: GameObject) => boolean): void {
		const destroyedObjects = this._gameObjects.filter(g => filter(g))
		for (let object of destroyedObjects) object.OnDestroy()
		this._gameObjects = this._gameObjects.filter(g => !filter(g))
	}

	private OnDestroy(): void {
		for (let gameObject of this.gameObjects) gameObject.OnDestroy()
	}

	private OnSceneStart(): void {
		for (let gameObject of this.gameObjects) gameObject.OnSceneStart()
	}

	private OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		for (let gameObject of this.gameObjects)
			gameObject.OnBeforeFrameRender(currentFrame, frameCount)
	}

	private OnAfterFrameRender(currentFrame: number, frameCount: number): void {
		for (let gameObject of this.gameObjects)
			gameObject.OnAfterFrameRender(currentFrame, frameCount)
	}

	private OnFixedUpdate(turnIndex: number): void {
		for (let gameObject of this.gameObjects) gameObject.OnFixedUpdate(turnIndex)
	}

	private OnFixedUpdateEnded(turnIndex: number): void {
		for (let gameObject of this.gameObjects)
			gameObject.OnFixedUpdateEnded(turnIndex)
	}

	public Start(): void {
		this.state = SceneState.Starting
		this.OnSceneStart()
		this.turnIndex = 0
		this.state = SceneState.ReadyToNextTurn
		this.RenderFrame()
	}

	public RenderFrame(): void {
		if (this.playModeParameters.disableRender) return

		let renderComponents: AbstractRenderComponent[] =
			new Array<AbstractRenderComponent>()
		for (let gameObject of this.gameObjects) {
			renderComponents = renderComponents.concat(
				gameObject.GetComponents(AbstractRenderComponent)
			)
		}

		renderComponents = renderComponents.sort((a, b) => a.zOrder - b.zOrder)

		const context = <CanvasRenderingContext2D>this.canvas.getContext('2d')

		context.clearRect(0, 0, this.canvas.width, this.canvas.height)

		for (let component of renderComponents) {
			const image = component.Image
			const pos = component.gameObject.position
				.Add(component.offset)
				.Add(this.renderOffset)
			const dw = component.size.x
			const dh = component.size.y
			context.drawImage(
				image,
				pos.x * this.tileSizeScale,
				pos.y * this.tileSizeScale,
				dw * this.tileSizeScale,
				dh * this.tileSizeScale
			)
		}
	}

	private async AnimationStep() {
		if (this.playModeParameters.disableAnimation) {
			this.RenderFrame()
			return
		}

		for (let i = 0; i < this.animTicksCount; ++i) {
			this.OnBeforeFrameRender(i, this.animTicksCount)
			this.RenderFrame()
			this.OnAfterFrameRender(i, this.animTicksCount)
			await Delay(this.animTicksTime)
		}
	}

	public async DoNextTurn() {
		if (this.state != SceneState.ReadyToNextTurn) {
			throw new Error(
				`Expected state==${SceneState.ReadyToNextTurn}, but got ${this.state}`
			)
		}

		if (this.turnIndex >= this.maxTurnIndex) {
			throw new Error('turnIndex == this.maxTurnIndex')
		}

		this.turnIndex++

		if (this.turnIndex == this.maxTurnIndex) {
			this.StopAutoTurn()
		}

		this.state = SceneState.NextTurn
		this.OnFixedUpdate(this.turnIndex)

		this.state = SceneState.Animation
		await this.AnimationStep()

		this.OnFixedUpdateEnded(this.turnIndex)
		this.state = SceneState.ReadyToNextTurn
	}

	public StopAutoTurn(): void {
		if (!this.autoTurnTimerId) {
			throw new Error('AutoTurn not started')
		}
		clearTimeout(this.autoTurnTimerId)
		this.autoTurnTimerId = undefined
	}

	public StartAutoTurn(): void {
		if (this.state != SceneState.ReadyToNextTurn) {
			throw new Error(
				`Expected state==${SceneState.ReadyToNextTurn}, but got ${this.state}`
			)
		}

		if (this.turnIndex == this.maxTurnIndex) {
			throw new Error('turnIndex == this.maxTurnIndex')
		}

		if (this.autoTurnTimerId) {
			throw new Error('AutoTurn already started')
		}

		this.DoNextTurn().catch(reason => {
			throw reason
		})
		this.autoTurnTimerId = window.setInterval(
			() =>
				this.DoNextTurn().catch(reason => {
					throw reason
				}),
			this.autoTurnTime
		)
	}
}
