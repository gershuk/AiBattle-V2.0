import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import {
	ComponentParameters,
	GameObjectComponent,
} from '../GameObjectComponent'
import { Vector2 } from '../Vector2'

export class AbstractRenderComponent extends GameObjectComponent {
	private _zOrder: number
	public get zOrder(): number {
		return this._zOrder
	}
	public set zOrder(v: number) {
		this._zOrder = v
	}

	public Render(viewPort: ViewPort) {}

	public Init(
		gameObjectRef: SafeReference<IGameObject>,
		parameters?: AbstractRenderComponentParameters
	): void {
		super.Init(gameObjectRef, parameters)

		if (parameters) {
				this.zOrder = parameters.zOrder
		}
	}
}

export class AbstractRenderComponentParameters extends ComponentParameters {
	zOrder: number

	constructor(
		executionPriority: number = 0,
		label?: string,
		zOrder: number = 0
	) {
		super(executionPriority, label)
		this.zOrder = zOrder
	}
}

export class ViewPort {
	private _tileSizeScale: number

	private _renderOffset: Vector2
	private _canvasRenderingContext: CanvasRenderingContext2D
	public get tileSizeScale(): number {
		return this._tileSizeScale
	}

	public set tileSizeScale(v: number) {
		this._tileSizeScale = v
	}

	public get renderOffset(): Vector2 {
		return this._renderOffset
	}

	public set renderOffset(v: Vector2) {
		this._renderOffset = v
	}

	public get canvasRenderingContext(): CanvasRenderingContext2D {
		return this._canvasRenderingContext
	}

	public set canvasRenderingContext(v: CanvasRenderingContext2D) {
		this._canvasRenderingContext = v
	}

	constructor(
		canvasRenderingContext: CanvasRenderingContext2D,
		tileSizeScale: number = 1,
		renderOffset: Vector2 = new Vector2()
	) {
		this.canvasRenderingContext = canvasRenderingContext
		this.tileSizeScale = tileSizeScale
		this.renderOffset = renderOffset
	}
}
