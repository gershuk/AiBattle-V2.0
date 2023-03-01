import {
	GameObjectComponent,
	ComponentParameters,
} from '../BaseComponents/GameObjectComponent'
import { GameObject } from '../GameObject/GameObject'
import { Vector2 } from '../BaseComponents/Vector2'
import { IMessageBroker } from 'GameEngine/MessageBroker/IMessageBroker'

export interface IScene {
	get playModeParameters(): PlayModeParameters

	get tileSizeScale(): Number

	set tileSizeScale(v: Number)

	get messageBroker(): IMessageBroker

	get mousePositionOnCanvas(): Vector2

	get canvas(): HTMLCanvasElement

	get gameObjects(): GameObject[]

	get renderOffset(): Vector2

	set renderOffset(v: Vector2)

	set turnIndex(turnIndex: number)

	get turnIndex(): number

	set maxTurnIndex(maxTurnIndex: number)

	get maxTurnIndex(): number

	set animTicksCount(animTicksCount: number)

	get animTicksCount(): number

	set animTicksTime(animTicksTime: number)

	get animTicksTime(): number

	set autoTurnTime(autoTurnTime: number)

	get autoTurnTime(): number

	set autoTurnTimerId(autoTurnTimerId: number | undefined)

	get autoTurnTimerId(): number | undefined

	AddGameObject<T extends GameObject>(
		position: Vector2,
		gameObject: T,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string
	): void

	AddGameObjects<T extends GameObject>(
		gameObjectInits: [
			Vector2,
			T,
			[GameObjectComponent, ComponentParameters?][]
		][]
	): void

	GetGameObjectsByFilter(filter: (g: GameObject) => boolean): GameObject[]

	RemoveGameObjectsByFilter(filter: (g: GameObject) => boolean): void

	Start(): void

	RenderFrame(): void

	DoNextTurn(): void

	StopAutoTurn(): void

	StartAutoTurn(): void

	Init(parameters: SceneParameters): void
}

export class PlayModeParameters {
	disableAnimation: boolean = false
	disableRender: boolean = false
	useRemoteControllers: boolean = false
}

export class SceneParameters {
	maxTurnIndex: number
	animTicksCount: number
	animTicksTime: number
	autoTurnTime: number
	canvas: HTMLCanvasElement
	tileSizeScale: number
	playModeParameters: PlayModeParameters

	constructor(
		maxTurnIndex: number,
		animTicksCount: number,
		animTicksTime: number,
		autoTurnTime: number,
		canvas: HTMLCanvasElement,
		tileSizeScale: number = 1,
		playModeParameters: PlayModeParameters = new PlayModeParameters()
	) {
		this.maxTurnIndex = maxTurnIndex
		this.animTicksCount = animTicksCount
		this.animTicksTime = animTicksTime
		this.autoTurnTime = autoTurnTime
		this.canvas = canvas
		this.tileSizeScale = tileSizeScale
		this.playModeParameters = playModeParameters
	}
}
