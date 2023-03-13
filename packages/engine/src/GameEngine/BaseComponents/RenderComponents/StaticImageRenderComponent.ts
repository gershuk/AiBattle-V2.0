import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { ComponentParameters } from '../GameObjectComponent'
import { Vector2 } from '../Vector2'
import { AbstractImageRenderComponent } from './AbstractImageRenderComponent'

export class StaticImageRenderComponent extends AbstractImageRenderComponent {
	private _offset: Vector2
	public get offset(): Vector2 {
		return this._offset
	}
	public set offset(o: Vector2) {
		this._offset = o
	}

	private _size: Vector2
	public get size(): Vector2 {
		return this._size
	}
	public set size(s: Vector2) {
		this._size = s
	}

	private _image: HTMLImageElement
	public get image(): HTMLImageElement {
		return this._image
	}
	protected set image(image: HTMLImageElement) {
		this._image = image
	}

	Init(gameObject: IGameObject, parameters?: StaticRenderComponentParameters) {
		super.Init(gameObject, parameters)
		if (parameters) {
			this.size = parameters.size
			this.offset = parameters.offset
			this.image = parameters.image
			this.zOrder = parameters.zOrder
		}
	}
}

export class StaticRenderComponentParameters extends ComponentParameters {
	offset: Vector2
	size: Vector2
	image: HTMLImageElement
	zOrder: number

	constructor(
		size: Vector2,
		image: HTMLImageElement,
		zOrder: number = 0,
		offset: Vector2 = new Vector2()
	) {
		super()
		this.offset = offset
		this.size = size
		this.image = image
		this.zOrder = zOrder
	}
}
