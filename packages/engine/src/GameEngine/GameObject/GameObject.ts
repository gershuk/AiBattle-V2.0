import { GenerateUUID } from 'Utilities'
import {
	GameObjectComponent,
	ComponentParameters,
} from '../BaseComponents/GameObjectComponent'
import { IGameObject } from './IGameObject'
import { IScene } from '../Scene/IScene'
import { Vector2 } from '../BaseComponents/Vector2'
import { UpdatableGroup } from 'GameEngine/ObjectBaseType/UpdatableGroup'
import { UpdatableObjectArrayContainer } from 'GameEngine/ObjectBaseType/UpdatableObjectArrayContainer'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export class GameObject
	extends UpdatableGroup<GameObjectComponent>
	implements IGameObject
{
	private _scene: IScene | undefined
	private _position: Vector2

	public get position(): Vector2 {
		return this._position
	}

	public set position(v: Vector2) {
		this._position = v
	}

	public get scene(): IScene {
		return this._scene
	}

	Init(
		position: Vector2,
		scene?: IScene,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string,
		executionPriority: number = 0
	) {
		this._position = position
		this._container = new UpdatableObjectArrayContainer()
		this.uuid = id ?? GenerateUUID()
		this._scene = scene
		this.executionPriority = executionPriority
		this.AddComponents(newComponents)
		this.OnInit()
	}

	public AddComponents(
		newComponents?: [GameObjectComponent, ComponentParameters?][]
	): void {
		if (newComponents) {
			for (let component of newComponents) {
				component[0].Init(this, component[1])
				this.Add(component[0])
			}
		}
	}

	public RemoveComponents<T extends typeof GameObjectComponent>(type: T): void {
		this.DestroyObjectsByFilter(r => !(r.object instanceof type))
	}

	//ToDo : Try change return type to T
	public GetComponents<T extends typeof GameObjectComponent>(
		type: T
	): SafeReference<GameObjectComponent>[] {
		return this.GetSafeRefsByFilter(r => r.object instanceof type)
	}

	public OnInit(): void {
		for (let componentRef of this._container) componentRef.object.OnOwnerInit()
	}
}
