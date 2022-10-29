import {
	AbstractObjectComponent,
	ComponentParameters,
} from './AbstractObjectComponent'
import { IScene } from './IScene'
import { Vector2 } from './Vector2'

export interface IGameObject {
	get owner(): IScene

	get id(): string

	get position(): Vector2

	Init(
		position: Vector2,
		owner?: IScene,
		...newComponents: [AbstractObjectComponent, ComponentParameters?][]
	): void

	AddComponents(
		...newComponents: [AbstractObjectComponent, ComponentParameters?][]
	): void

	RemoveComponents<T extends typeof AbstractObjectComponent>(type: T): void

	GetComponents<T extends typeof AbstractObjectComponent>(type: T): T[]

	OnSceneStart(): void

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void

	OnAfterFrameRender(currentFrame: number, frameCount: number): void

	OnFixedUpdate(index: number): void
}
