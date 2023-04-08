import {
	GameObjectComponent,
	ComponentParameters,
} from '../BaseComponents/GameObjectComponent'
import { IScene } from '../Scene/IScene'
import { Vector2 } from '../BaseComponents/Vector2'
import { UpdatableGroup } from 'GameEngine/ObjectBaseType/UpdatableGroup'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export interface IGameObject extends UpdatableGroup<GameObjectComponent> {
	get scene(): IScene

	get position(): Vector2

	set position(v: Vector2)

	OnInit(): void

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

	GetComponents<T extends typeof GameObjectComponent>(
		type: T
	): SafeReference<GameObjectComponent>[]
}
