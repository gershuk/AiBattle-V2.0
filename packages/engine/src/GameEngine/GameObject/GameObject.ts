import * as Utilities from 'Utilities'
import {
	GameObjectComponent,
	ComponentParameters,
} from '../BaseComponents/GameObjectComponent'
import { IGameObject } from './IGameObject'
import { IScene } from '../Scene/IScene'
import { Vector2 } from '../BaseComponents/Vector2'

export class GameObject implements IGameObject {
	private _id: string
	private _components: GameObjectComponent[]
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

	public get id(): string {
		return this._id
	}

	public set id(id: string) {
		this._id = id
	}

	Init(
		position: Vector2,
		scene?: IScene,
		newComponents?: [GameObjectComponent, ComponentParameters?][],
		id?: string
	) {
		this._position = position
		this._components = new Array<GameObjectComponent>()
		this.id = id ?? Utilities.GenerateUUID()
		this._scene = scene
		this.AddComponents(newComponents)
		this.OnInit()
	}

	public AddComponents(
		newComponents?: [GameObjectComponent, ComponentParameters?][]
	): void {
		if (newComponents) {
			for (let component of newComponents) {
				component[0].Init(this, component[1])
				this._components.push(component[0])
			}
		}
	}

	public RemoveComponents<T extends typeof GameObjectComponent>(type: T): void {
		this._components = this._components.filter(c => !(c instanceof type))
	}

	public GetComponents<T extends typeof GameObjectComponent>(type: T): any {
		return this._components.filter(c => c instanceof type)
	}

	public OnInit(): void {
		for (let component of this._components) component.OnOwnerInit()
	}

	public OnDestroy(): void {
		for (let component of this._components) component.OnDestroy()
	}

	public OnSceneStart(): void {
		for (let component of this._components) component.OnSceneStart()
	}

	public OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		for (let component of this._components)
			component.OnBeforeFrameRender(currentFrame, frameCount)
	}

	public OnAfterFrameRender(currentFrame: number, frameCount: number): void {
		for (let component of this._components)
			component.OnAfterFrameRender(currentFrame, frameCount)
	}

	//sort only on add\delete
	public OnFixedUpdate(index: number): void {
		const sortedArray = this._components.sort(
			(a, b) => a.executionPriority - b.executionPriority
		)
		for (let component of sortedArray) component.OnFixedUpdate(index)
	}

	public OnFixedUpdateEnded(index: number): void {
		const sortedArray = this._components.sort(
			(a, b) => a.executionPriority - b.executionPriority
		)
		for (let component of sortedArray) component.OnFixedUpdateEnded(index)
	}
}
