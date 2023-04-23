import { Vector2 } from '../Vector2'
import { AbstractRenderComponent, ViewPort } from './AbstractRenderComponent'

export abstract class AbstractImageRenderComponent extends AbstractRenderComponent {
	abstract get offset(): Vector2
	abstract get size(): Vector2
	abstract get image(): HTMLImageElement

	protected RenderImage(viewPort: ViewPort) {
		const pos = this.gameObjectRef.object.position
			.Add(this.offset)
			.Add(viewPort.renderOffset)
		const dw = this.size.x
		const dh = this.size.y
		viewPort.canvasRenderingContext.drawImage(
			this.image,
			pos.x * viewPort.tileSizeScale,
			pos.y * viewPort.tileSizeScale,
			dw * viewPort.tileSizeScale,
			dh * viewPort.tileSizeScale
		)
	}

	public Render(viewPort: ViewPort) {
		this.RenderImage(viewPort)
	}
}
