import { Vector2 } from '../Vector2'
import { AbstractRenderComponent, ViewPort } from './AbstractRenderComponent'

export abstract class AbstractTextRenderComponent extends AbstractRenderComponent {
	abstract get offset(): Vector2
	abstract get maxWidth(): number | undefined
	abstract get text(): string

	abstract get font(): string
	abstract get textAlign(): CanvasTextAlign
	abstract get textBaseline(): CanvasTextBaseline
	abstract get direction(): CanvasDirection
	abstract get fillStyle(): string | CanvasGradient | CanvasPattern
	abstract get strokeStyle(): string | CanvasGradient | CanvasPattern

	protected RenderText(viewPort: ViewPort) {
		const pos = this.gameObjectRef.object.position
			.Add(this.offset)
			.Add(viewPort.renderOffset)
		viewPort.canvasRenderingContext.fillText(
			this.text,
			pos.x,
			pos.y,
			this.maxWidth
		)
	}

	protected SetStyle(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.fillStyle
		ctx.strokeStyle = this.strokeStyle

		ctx.font = this.font
		ctx.textAlign = this.textAlign
		ctx.textBaseline = this.textBaseline
		ctx.direction = this.direction
	}

	public Render(viewPort: ViewPort) {
		this.SetStyle(viewPort.canvasRenderingContext)
		this.RenderText(viewPort)
	}
}
