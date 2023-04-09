import {
	GameObjectComponent,
	ComponentParameters,
} from '../BaseComponents/GameObjectComponent'
import { GameObject } from '../GameObject/GameObject'
import { IScene, PlayModeParameters, SceneParameters } from './IScene'
import { Vector2 } from '../BaseComponents/Vector2'
import { MessageBroker } from 'GameEngine/MessageBroker/MessageBroker'
import { IMessageBroker } from 'GameEngine/MessageBroker/IMessageBroker'
import {
	AbstractRenderComponent,
	ViewPort,
} from 'GameEngine/BaseComponents/RenderComponents/AbstractRenderComponent'
import { Delay } from 'Utilities/Delay'
import {
	IReadOnlyObjectContainer,
	SafeReference,
} from 'GameEngine/ObjectBaseType/ObjectContainer'
import { UpdatableGroup } from 'GameEngine/ObjectBaseType/UpdatableGroup'
import { UpdatableObjectArrayContainer } from 'GameEngine/ObjectBaseType/UpdatableObjectArrayContainer'
import {
	AbstractControllerCommand,
	AbstractControllerData,
} from 'GameEngine/UserAIRuner/AbstractController'
import { ControllerBody } from 'GameEngine/UserAIRuner/ControllerBody'
import { SlimEvent } from 'Utilities'

enum SceneState {
	Init,
	Starting,
	ReadyToNextTurn,
	CalcCommands,
	CreationStage,
	NextTurn,
	Animation,
	EndGame,
}

export class Scene extends UpdatableGroup<GameObject> implements IScene {
	private _onSceneStart: SlimEvent<void>
	private _onTurnStart: SlimEvent<void>
	private _onTurnEnd: SlimEvent<void>
	private _onGameEnd: SlimEvent<void>
	private _isGameEnd:
		| ((refs: IReadOnlyObjectContainer<GameObject>) => boolean)
		| undefined
	private _tileSizeScale: number
	private _turnIndex: number
	private _maxTurnIndex: number
	private _autoTurnTime: number
	private _autoTurnTimerId?: number
	private _state: SceneState
	private _animTicksCount: number
	private _animTicksTime: number
	private _canvas: HTMLCanvasElement
	private _playModeParameters: PlayModeParameters
	private _messageBroker: IMessageBroker
	private _mousePositionOnCanvas: Vector2 | undefined
	private _renderOffset: Vector2
	private _initTimeout: number
	private _turnCalcTimeout: number

	get OnSceneStart(): SlimEvent<void> {
		return this._onSceneStart
	}
	get OnTurnStart(): SlimEvent<void> {
		return this._onTurnStart
	}
	get OnTurnEnd(): SlimEvent<void> {
		return this._onTurnEnd
	}
	get OnGameEnd(): SlimEvent<void> {
		return this._onGameEnd
	}

	get isGameEnd():
		| ((refs: IReadOnlyObjectContainer<GameObject>) => boolean)
		| undefined {
		return this._isGameEnd
	}
	public set isGameEnd(
		v: ((refs: IReadOnlyObjectContainer<GameObject>) => boolean) | undefined
	) {
		this._isGameEnd = v
	}

	public get playModeParameters(): PlayModeParameters {
		return this._playModeParameters
	}
	protected set playModeParameters(v: PlayModeParameters) {
		this._playModeParameters = v
	}

	public get messageBroker(): IMessageBroker {
		return this._messageBroker
	}
	private set messageBroker(v: IMessageBroker) {
		this._messageBroker = v
	}

	public get mousePositionOnCanvas(): Vector2 {
		return this._mousePositionOnCanvas
	}
	protected set mousePositionOnCanvas(v: Vector2) {
		this._mousePositionOnCanvas = v
	}

	public get renderOffset(): Vector2 {
		return this._renderOffset
	}
	public set renderOffset(v: Vector2) {
		this._renderOffset = v
	}

	public get turnIndex(): number {
		return this._turnIndex ?? 0
	}
	public set turnIndex(turnIndex: number) {
		if (turnIndex < 0) throw new Error('turnIndex < 0')
		this._turnIndex = turnIndex
	}

	public get maxTurnIndex(): number {
		return this._maxTurnIndex
	}
	public set maxTurnIndex(maxTurnIndex: number) {
		if (maxTurnIndex < 1) throw new Error('maxTurnIndex < 1')
		this._maxTurnIndex = maxTurnIndex
	}

	public get state(): SceneState {
		return this._state
	}
	protected set state(state: SceneState) {
		this._state = state
	}

	public get animTicksCount(): number {
		return this._animTicksCount
	}
	public set animTicksCount(animTicksCount: number) {
		if (animTicksCount < 1) throw new Error('animTicksCount < 1')
		this._animTicksCount = animTicksCount
	}

	public get animTicksTime(): number {
		return this._animTicksTime
	}
	public set animTicksTime(animTicksTime: number) {
		if (animTicksTime < 0) throw new Error('animTicksTime < 0')
		this._animTicksTime = animTicksTime
	}

	public get autoTurnTime(): number {
		return this._autoTurnTime
	}
	public set autoTurnTime(autoTurnTime: number) {
		if (autoTurnTime < 1) throw new Error('autoTurnTime < 1')
		this._autoTurnTime = autoTurnTime
	}

	public get autoTurnTimerId(): number | undefined {
		return this._autoTurnTimerId
	}
	public set autoTurnTimerId(autoTurnTimerId: number | undefined) {
		this._autoTurnTimerId = autoTurnTimerId
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

	public get initTimeout(): number {
		return this._initTimeout
	}

	public set initTimeout(v: number) {
		this._initTimeout = v
	}

	public get commandCalcTimeout(): number {
		return this._turnCalcTimeout
	}

	public set commandCalcTimeout(v: number) {
		this._turnCalcTimeout = v
	}

	Init(parameters: SceneParameters): void {
		if (this.IsAutoTurn()) this.StopAutoTurn()

		this._onSceneStart = new SlimEvent<void>()
		this._onTurnStart = new SlimEvent<void>()
		this._onTurnEnd = new SlimEvent<void>()
		this._onGameEnd = new SlimEvent<void>()

		this.messageBroker = new MessageBroker()

		this.maxTurnIndex = parameters.maxTurnIndex
		this.autoTurnTime = parameters.autoTurnTime
		this.animTicksCount = parameters.animTicksCount
		this.animTicksTime = parameters.animTicksTime
		this.initTimeout = parameters.initTimeout
		this.commandCalcTimeout = parameters.commandCalcTimeout
		this.canvas = parameters.canvas
		this.tileSizeScale = parameters.tileSizeScale

		this._container = new UpdatableObjectArrayContainer()
		this.renderOffset = new Vector2(0, 0)

		this.state = SceneState.Init

		this.InitMouseEventListener()

		this.playModeParameters = parameters.playModeParameters
		this.isGameEnd = parameters.isGameEnd
	}

	private InitMouseEventListener() {
		if (this.canvas) {
			this.mousePositionOnCanvas = new Vector2()
			this.canvas.addEventListener('mousemove', event => {
				const rect = (
					event.currentTarget as HTMLCanvasElement
				).getBoundingClientRect()
				const x = event.clientX - rect.left
				const y = event.clientY - rect.top
				this.mousePositionOnCanvas.SetXY(x, y)
			})
		} else {
			this.mousePositionOnCanvas = undefined
		}
	}

	CreateDefaultGameObject(
		position: Vector2,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string
	): SafeReference<GameObject> {
		const gameObject = new GameObject()
		return this.AddGameObject(position, gameObject, newComponents, id)
	}

	public CheckGameEnd(): boolean {
		return this.isGameEnd && this.isGameEnd(this.GetReadonlyContainer())
	}

	public AddGameObject<T extends GameObject>(
		position: Vector2,
		gameObject: T,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string
	): SafeReference<GameObject> {
		const ref = this._container.Add(gameObject, () =>
			gameObject.Init(position, this, newComponents, id)
		)
		return ref
	}

	public AddGameObjects<T extends GameObject>(
		gameObjectInits: [
			Vector2,
			T,
			[GameObjectComponent, ComponentParameters?][]
		][]
	): SafeReference<GameObject>[] {
		const refs: SafeReference<GameObject>[] = []
		for (let gameObjectInit of gameObjectInits)
			refs.push(
				this.AddGameObject(
					gameObjectInit[0],
					gameObjectInit[1],
					gameObjectInit[2]
				)
			)
		return refs
	}

	public GetGameObjectsRefByFilter(
		filter: (g: SafeReference<GameObject>) => boolean
	): SafeReference<GameObject>[] {
		return this.GetSafeRefsByFilter(filter)
	}

	public RemoveGameObjectsByFilter(
		filter: (g: SafeReference<GameObject>) => boolean
	): void {
		return this.DestroyObjectsByFilter(filter)
	}

	public async Start(): Promise<unknown> {
		this.state = SceneState.Starting
		this.OnFinalize()
		this._onSceneStart.Notify()
		this.OnStart()
		await this.InitControllers()
		this.turnIndex = 0
		this.OnFinalize()
		this.state = SceneState.ReadyToNextTurn
		this.RenderFrame()
		return Promise.resolve()
	}

	public RenderFrame(): void {
		if (this.playModeParameters.disableRender) return

		let renderRefs: SafeReference<AbstractRenderComponent>[] = []
		for (let gameObject of this.GetReadonlyContainer()) {
			renderRefs = renderRefs.concat(
				gameObject.object.GetComponents(
					AbstractRenderComponent
				) as SafeReference<AbstractRenderComponent>[]
			)
		}

		renderRefs = renderRefs.sort((a, b) => a.object.zOrder - b.object.zOrder)

		const context = <CanvasRenderingContext2D>this.canvas.getContext('2d')

		context.clearRect(0, 0, this.canvas.width, this.canvas.height)

		const viewPort = new ViewPort(
			context,
			this.tileSizeScale,
			this.renderOffset
		)

		for (let ref of renderRefs) {
			const component = ref.object
			component.Render(viewPort)
		}
	}

	private async AnimationStep() {
		if (this.playModeParameters.disableAnimation) {
			return
		}

		for (let i = 0; i < this.animTicksCount; ++i) {
			this.OnBeforeFrameRender(i, this.animTicksCount)
			this.RenderFrame()
			this.OnAfterFrameRender(i, this.animTicksCount)
			await Delay(this.animTicksTime)
		}
	}

	protected async InitControllers() {
		for (let gameObject of this.GetReadonlyContainer()) {
			const bodiesRefs = gameObject.object.GetComponents(
				ControllerBody
			) as SafeReference<
				ControllerBody<
					AbstractControllerData,
					AbstractControllerData,
					AbstractControllerCommand
				>
			>[]

			for (let body of bodiesRefs) {
				await body.object.InitStartData()
			}
		}
	}

	protected async CalcCommands(turnIndex: number) {
		for (let gameObject of this.GetReadonlyContainer()) {
			const bodiesRefs = gameObject.object.GetComponents(
				ControllerBody
			) as SafeReference<
				ControllerBody<
					AbstractControllerData,
					AbstractControllerData,
					AbstractControllerCommand
				>
			>[]

			for (let body of bodiesRefs) {
				await body.object.CalcAndExecuteCommand(turnIndex)
			}
		}
	}

	public async DoNextTurn(): Promise<unknown> {
		if (this.TryStopIfGameEnd()) {
			return Promise.resolve()
		}

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

		this._onTurnStart.Notify()

		this.OnFinalize()

		this.state = SceneState.CalcCommands
		await this.CalcCommands(this.turnIndex)

		this.state = SceneState.CreationStage
		await this.OnObjectCreationStage(this.turnIndex)

		this.OnFinalize()

		this.state = SceneState.NextTurn
		this.OnFixedUpdate(this.turnIndex)

		this.state = SceneState.Animation
		await this.AnimationStep()

		this.OnFixedUpdateEnded(this.turnIndex)
		this.state = SceneState.ReadyToNextTurn

		this.RenderFrame()

		this._onTurnEnd.Notify()
		this.TryStopIfGameEnd()
		return Promise.resolve()
	}

	public StopAutoTurn(): void {
		if (!this.IsAutoTurn()) {
			throw new Error('AutoTurn not started')
		}
		clearTimeout(this.autoTurnTimerId)
		this.autoTurnTimerId = undefined
	}

	private SetGameEnd() {
		if (this.state != SceneState.EndGame) {
			console.log('Game ended!')
			if (this.IsAutoTurn()) this.StopAutoTurn()
			this.state = SceneState.EndGame
			this._onGameEnd.Notify()
		}
	}

	private TryStopIfGameEnd() {
		if (this.CheckGameEnd()) {
			this.SetGameEnd()
			return true
		}
		return false
	}

	public StartAutoTurn(): void {
		if (this.TryStopIfGameEnd()) return

		if (this.state != SceneState.ReadyToNextTurn) {
			throw new Error(
				`Expected state==${SceneState.ReadyToNextTurn}, but got ${this.state}`
			)
		}

		if (this.turnIndex == this.maxTurnIndex) {
			throw new Error('turnIndex == this.maxTurnIndex')
		}

		if (this.IsAutoTurn()) {
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

	IsAutoTurn(): boolean {
		return this.autoTurnTimerId !== undefined && this.autoTurnTimerId !== null
	}
}
