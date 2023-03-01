import {
	GameObjectComponent,
	ComponentParameters,
} from '../BaseComponents/GameObjectComponent'
import { IScene } from '../Scene/IScene'
import { Vector2 } from '../BaseComponents/Vector2'

export interface IGameObject {
	get scene(): IScene

	get id(): string

	get position(): Vector2

	set position(v: Vector2)

	Init(
		position: Vector2,
		scene?: IScene,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string
	): void

	AddComponents(
		newComponents: [GameObjectComponent, ComponentParameters?][]
	): void

	RemoveComponents<T extends typeof GameObjectComponent>(type: T): void

	GetComponents<T extends typeof GameObjectComponent>(type: T): T[]

	OnSceneStart(): void

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void

	OnAfterFrameRender(currentFrame: number, frameCount: number): void

	OnFixedUpdateEnded(index: number): void

	OnFixedUpdate(index: number): void
}
