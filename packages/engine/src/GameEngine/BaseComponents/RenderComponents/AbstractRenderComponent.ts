import { GameObjectComponent } from '../GameObjectComponent'
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
}

export class ViewPort {
	private _tileSizeScale: number

	public get tileSizeScale(): number {
		return this._tileSizeScale
	}

	public set tileSizeScale(v: number) {
		this._tileSizeScale = v
	}

	private _renderOffset: Vector2

	public get renderOffset(): Vector2 {
		return this._renderOffset
	}

	public set renderOffset(v: Vector2) {
		this._renderOffset = v
	}

	private _canvasRenderingContext: CanvasRenderingContext2D

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
