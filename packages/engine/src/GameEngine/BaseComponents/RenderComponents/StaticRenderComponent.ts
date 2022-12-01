import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import {
	AbstractObjectComponent,
	ComponentParameters,
} from '../AbstractObjectComponent'
import { Vector2 } from '../Vector2'

export class StaticRenderComponent extends AbstractObjectComponent {
	private _offset: Vector2
	public get offset(): Vector2 {
		return this._offset
	}
	protected set offset(o: Vector2) {
		this._offset = o
	}

	private _size: Vector2
	public get size(): Vector2 {
		return this._size
	}
	protected set size(s: Vector2) {
		this._size = s
	}

	private _zOder: number
	public get zOder(): number {
		return this._zOder
	}
	public set zOder(v: number) {
		this._zOder = v
	}

	private _image: HTMLImageElement
	public get Image(): HTMLImageElement {
		return this._image
	}
	protected set Image(image: HTMLImageElement) {
		this._image = image
	}

	Init(owner: IGameObject, parameters?: ComponentParameters) {
		super.Init(owner, parameters)
		if (parameters) {
			if (parameters instanceof StaticRenderComponentParameters) {
				this.size = parameters.size
				this.offset = parameters.offset
				this.Image = parameters.image
				this.zOder = parameters.zOder
			} else {
				throw new Error(
					'Expect parameters of type StaticRenderComponentParameters'
				)
			}
		}
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {}
}

export class StaticRenderComponentParameters {
	offset: Vector2
	size: Vector2
	image: HTMLImageElement
	zOder: number

	constructor(
		size: Vector2,
		image: HTMLImageElement,
		zOder: number = 0,
		offset: Vector2 = new Vector2()
	) {
		this.offset = offset
		this.size = size
		this.image = image
		this.zOder = zOder
	}
}
