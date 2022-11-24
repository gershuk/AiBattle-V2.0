import {
	AbstractObjectComponent,
	ComponentParameters,
} from '../BaseComponents/AbstractObjectComponent'
import { GameObject } from '../GameObject/GameObject'
import { Vector2 } from '../BaseComponents/Vector2'

export interface IScene {
	get gameObjects(): GameObject[]

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
		gameObjectInits: T,
		...newComponents: [AbstractObjectComponent, ComponentParameters?][]
	): void

	AddGameObjects<T extends GameObject>(
		gameObjectInits: [
			Vector2,
			T,
			[AbstractObjectComponent, ComponentParameters?][]
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

export class SceneParameters {
	maxTurnIndex: number
	animTicksCount: number
	animTicksTime: number
	autoTurnTime: number
	canvas: HTMLCanvasElement

	constructor(
		maxTurnIndex: number,
		animTicksCount: number,
		animTicksTime: number,
		autoTurnTime: number,
		canvas: HTMLCanvasElement
	) {
		this.maxTurnIndex = maxTurnIndex
		this.animTicksCount = animTicksCount
		this.animTicksTime = animTicksTime
		this.autoTurnTime = autoTurnTime
		this.canvas = canvas
	}
}
