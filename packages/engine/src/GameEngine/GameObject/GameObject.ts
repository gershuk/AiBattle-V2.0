import * as Utilities from 'Utilities'
import {
	AbstractObjectComponent,
	ComponentParameters,
} from '../BaseComponents/AbstractObjectComponent'
import { IGameObject } from './IGameObject'
import { IScene } from '../Scene/IScene'
import { Vector2 } from '../BaseComponents/Vector2'

export class GameObject implements IGameObject {
	private _id: string
	private _components: AbstractObjectComponent[]
	private _owner: IScene | undefined
	private _position: Vector2

	public get position(): Vector2 {
		return this._position
	}

	public set position(v: Vector2) {
		this._position = v
	}

	public get owner(): IScene {
		return this._owner
	}

	public get id(): string {
		return this._id
	}

	public set id(id: string) {
		this._id = id
	}

	constructor(
		position: Vector2,
		owner?: IScene,
		newComponents?: [AbstractObjectComponent, ComponentParameters?][],
		id?: string
	) {
		this.Init(position, owner, newComponents, id)
	}

	Init(
		position: Vector2,
		owner?: IScene,
		newComponents?: [AbstractObjectComponent, ComponentParameters?][],
		id?: string
	) {
		this._position = position
		this._components = new Array<AbstractObjectComponent>()
		this.id = id ?? Utilities.GenerateUUID()
		this._owner = owner
		this.AddComponents(newComponents)
		this.OnInit()
	}

	public AddComponents(
		newComponents?: [AbstractObjectComponent, ComponentParameters?][]
	): void {
		if (newComponents) {
			for (let component of newComponents) {
				component[0].Init(this, component[1])
				this._components.push(component[0])
			}
		}
	}

	public RemoveComponents<T extends typeof AbstractObjectComponent>(
		type: T
	): void {
		this._components = this._components.filter(c => !(c instanceof type))
	}

	public GetComponents<T extends typeof AbstractObjectComponent>(type: T): any {
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
		const sortedArray = this._components.sort((a, b) => a.qNumber - b.qNumber)
		for (let component of sortedArray) component.OnFixedUpdate(index)
	}

	public OnFixedUpdateEnded(index: number): void {
		const sortedArray = this._components.sort((a, b) => a.qNumber - b.qNumber)
		for (let component of sortedArray) component.OnFixedUpdateEnded(index)
	}
}
