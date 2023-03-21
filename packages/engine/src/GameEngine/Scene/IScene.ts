import {
	GameObjectComponent,
	ComponentParameters,
} from '../BaseComponents/GameObjectComponent'
import { GameObject } from '../GameObject/GameObject'
import { Vector2 } from '../BaseComponents/Vector2'
import { IMessageBroker } from 'GameEngine/MessageBroker/IMessageBroker'
import { UpdatableGroup } from 'GameEngine/ObjectBaseType/UpdatableGroup'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export interface IScene extends UpdatableGroup<GameObject> {
	get isGameEnd(): (refs: SafeReference<GameObject>[]) => boolean | undefined

	get playModeParameters(): PlayModeParameters

	get tileSizeScale(): Number

	set tileSizeScale(v: Number)

	get messageBroker(): IMessageBroker

	get mousePositionOnCanvas(): Vector2 | undefined

	get canvas(): HTMLCanvasElement

	get gameObjectRefs(): SafeReference<GameObject>[]

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

	get initTimeout(): number

	get commandCalcTimeout(): number

	CreateDefaultGameObject(
		position: Vector2,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string
	): SafeReference<GameObject>

	AddGameObject<T extends GameObject>(
		position: Vector2,
		gameObject: T,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string
	): SafeReference<GameObject>

	AddGameObjects<T extends GameObject>(
		gameObjectInits: [
			Vector2,
			T,
			[GameObjectComponent, ComponentParameters?][]
		][]
	): SafeReference<GameObject>[]

	GetGameObjectsRefByFilter(
		filter: (r: SafeReference<GameObject>) => boolean
	): SafeReference<GameObject>[]

	RemoveGameObjectsByFilter(
		filter: (r: SafeReference<GameObject>) => boolean
	): void

	Start(): Promise<unknown>

	RenderFrame(): void

	DoNextTurn(): Promise<unknown>

	StopAutoTurn(): void

	StartAutoTurn(): void

	Init(parameters: SceneParameters): void

	IsAutoTurn(): boolean
}

export class PlayModeParameters {
	disableAnimation: boolean = false
	disableRender: boolean = false

	constructor(
		disableAnimation: boolean = false,
		disableRender: boolean = false
	) {
		this.disableAnimation = disableAnimation
		this.disableRender = disableRender
	}
}

export class SceneParameters {
	maxTurnIndex: number
	animTicksCount: number
	animTicksTime: number
	autoTurnTime: number
	initTimeout: number
	commandCalcTimeout: number
	canvas: HTMLCanvasElement
	tileSizeScale: number
	playModeParameters: PlayModeParameters
	isGameEnd: (refs: SafeReference<GameObject>[]) => boolean | undefined

	constructor(
		maxTurnIndex: number,
		animTicksCount: number,
		animTicksTime: number,
		autoTurnTime: number,
		canvas: HTMLCanvasElement,
		tileSizeScale: number = 1,
		initTimeout: number = -1,
		commandCalcTimeout: number = -1,
		playModeParameters: PlayModeParameters = new PlayModeParameters(),
		isGameEnd?: (refs: SafeReference<GameObject>[]) => boolean
	) {
		this.maxTurnIndex = maxTurnIndex
		this.animTicksCount = animTicksCount
		this.animTicksTime = animTicksTime
		this.autoTurnTime = autoTurnTime
		this.initTimeout = initTimeout
		this.commandCalcTimeout = commandCalcTimeout
		this.canvas = canvas
		this.tileSizeScale = tileSizeScale
		this.playModeParameters = playModeParameters
		this.isGameEnd = isGameEnd
	}
}
