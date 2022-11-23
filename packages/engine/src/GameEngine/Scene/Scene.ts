import {
	AbstractObjectComponent,
	ComponentParameters,
} from '../BaseComponents/AbstractObjectComponent'
import { GameObject } from '../GameObject/GameObject'
import { IScene } from './IScene'
import { Vector2 } from '../BaseComponents/Vector2'
import { StaticRenderComponent } from 'GameEngine/BaseComponents/RenderComponents/StaticRenderComponent'

enum SceneState {
	Init,
	Starting,
	ReadyToNextTurn,
	NextTurn,
	Animation,
}

export class Scene implements IScene {
	private _gameObjects: GameObject[]
	private _turnIndex: number
	private _maxTurnIndex: number
	private _autoTurnTime: number
	private _autoTurnTimerId?: number
	private _state: SceneState
	private _animTicksCount: number
	private _animTicksTime: number
	private _canvas: HTMLCanvasElement

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

	constructor(
		canvas: HTMLCanvasElement,
		maxTurnIndex: number = 50,
		autoTurnTime: number = 500,
		animTicksCount: number = 1,
		animTicksTime: number = 50,
		gameObjects?: GameObject[]
	) {
		this.canvas = canvas
		this.gameObjects = gameObjects ?? new Array<GameObject>()
		this.animTicksCount = animTicksCount
		this.turnIndex = 0
		this.state = SceneState.Init
		this.maxTurnIndex = maxTurnIndex
		this.autoTurnTime = autoTurnTime
		this.animTicksTime = animTicksTime
	}

	public AddGameObject<T extends GameObject>(
		position: Vector2,
		gameObjectInits: T,
		...newComponents: [AbstractObjectComponent, ComponentParameters?][]
	): void {
		this._gameObjects.push(gameObjectInits)
		gameObjectInits.Init(position, this, ...newComponents)
	}

	public AddGameObjects<T extends GameObject>(
		gameObjectInits: [
			Vector2,
			T,
			[AbstractObjectComponent, ComponentParameters?][]
		][]
	): void {
		for (let gameObjectInit of gameObjectInits)
			this.AddGameObject(
				gameObjectInit[0],
				gameObjectInit[1],
				...gameObjectInit[2]
			)
	}

	public GetGameObjectsByFilter(
		filter: (g: GameObject) => boolean
	): GameObject[] {
		return this._gameObjects.filter(filter)
	}

	public RemoveGameObjectsByFilter(filter: (g: GameObject) => boolean): void {
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

	public Start(): void {
		this.state = SceneState.Starting
		this.OnSceneStart()
		this.turnIndex = 0
		this.state = SceneState.ReadyToNextTurn
	}

	public RenderFrame(): void {
		let renderComponents: StaticRenderComponent[] =
			new Array<StaticRenderComponent>()
		for (let gameObject of this.gameObjects) {
			renderComponents.push(gameObject.GetComponents(StaticRenderComponent))
		}

		renderComponents = renderComponents.sort((a,b)=>a.zOder-b.zOder);

		const context = < CanvasRenderingContext2D > this.canvas.getContext('2d');
		//ToDo : test ctx.beginPath();
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (let component of renderComponents)
		{
			const image = component.Image;
			const pos = component.Owner.position.Add(component.offset);
			const dw = component.size.x;
			const dh = component.size.y;
			context.drawImage(image,pos.x,pos.y,dw,dh)
			context.save()
		}
	}

	private AnimationStep(index: number, animTicksCount: number) {
		this.OnBeforeFrameRender(index, this.animTicksCount)
		this.RenderFrame()
		this.OnAfterFrameRender(index, this.animTicksCount)
		if (index + 1 <= animTicksCount) {
			setTimeout(
				this.AnimationStep,
				this.animTicksTime,
				index + 1,
				animTicksCount
			)
		} else {
			this.state = SceneState.ReadyToNextTurn
		}
	}

	public DoNextTurn(): void {
		if (this.state == SceneState.ReadyToNextTurn) {
			if (this.turnIndex >= this.maxTurnIndex) {
				throw new Error('turnIndex == this.maxTurnIndex')
			}
			this.state = SceneState.NextTurn
			this.turnIndex++
			this.OnFixedUpdate(this.turnIndex)
			this.state = SceneState.Animation
			this.AnimationStep(1, this.animTicksCount)
			if (this.turnIndex == this.maxTurnIndex) {
				this.StopAutoTurn()
			}
		}
	}

	public StopAutoTurn(): void {
		if (this.autoTurnTimerId) {
			clearTimeout(this.autoTurnTimerId)
			this.autoTurnTimerId = undefined
		} else {
			throw new Error('AutoNext not started')
		}
	}

	public StartAutoTurn(): void {
		if (this.state == SceneState.ReadyToNextTurn) {
			if (this.turnIndex == this.maxTurnIndex) {
				throw new Error('turnIndex == this.maxTurnIndex')
			}

			if (!this.autoTurnTimerId)
				this.autoTurnTimerId = window.setInterval(
					this.DoNextTurn,
					this.autoTurnTime
				)
			else throw new Error('AutoTurn already started')
		}
	}
}
