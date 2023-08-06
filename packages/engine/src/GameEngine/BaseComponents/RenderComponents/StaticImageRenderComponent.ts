import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { Vector2 } from '../Vector2'
import { AbstractImageRenderComponent } from './AbstractImageRenderComponent'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import { AbstractRenderComponentParameters } from './AbstractRenderComponent'

export class StaticImageRenderComponent extends AbstractImageRenderComponent {
	private _offset: Vector2
	private _size: Vector2
	private _image: HTMLImageElement
	public get offset(): Vector2 {
		return this._offset
	}
	public set offset(o: Vector2) {
		this._offset = o
	}

	public get size(): Vector2 {
		return this._size
	}
	public set size(s: Vector2) {
		this._size = s
	}

	public get image(): HTMLImageElement {
		return this._image
	}
	protected set image(image: HTMLImageElement) {
		this._image = image
	}

	Init(
		gameObjectRef: SafeReference<IGameObject>,
		parameters?: StaticRenderComponentParameters
	) {
		super.Init(gameObjectRef, parameters)
		if (parameters) {
			this.size = parameters.frame.size
			this.offset = parameters.frame.offset.Clone()
			this.image = parameters.frame.image
		}
	}
}

export class Sprite {
	offset: Vector2
	size: Vector2
	image: HTMLImageElement

	constructor(
		image: HTMLImageElement,
		size: Vector2 = new Vector2(),
		offset: Vector2 = new Vector2()
	) {
		this.image = image
		this.offset = offset
		this.size = size
	}
}

export class StaticRenderComponentParameters extends AbstractRenderComponentParameters {
	frame: Sprite

	constructor(
		frame: Sprite,
		zOrder: number = 0,
		executionPriority: number = 0,
		label?: string
	) {
		super(executionPriority, label, zOrder)
		this.frame = frame
	}
}
