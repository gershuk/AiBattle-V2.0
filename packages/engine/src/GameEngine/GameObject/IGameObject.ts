import {
	AbstractObjectComponent,
	ComponentParameters,
} from '../BaseComponents/AbstractObjectComponent'
import { IScene } from '../Scene/IScene'
import { Vector2 } from '../BaseComponents/Vector2'

export interface IGameObject {
	get owner(): IScene

	get id(): string

	get position(): Vector2

	set position(v: Vector2)

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

	OnFixedUpdateEnded(index: number): void

	OnFixedUpdate(index: number): void
}
