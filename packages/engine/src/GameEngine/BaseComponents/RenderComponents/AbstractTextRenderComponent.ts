import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import { Vector2 } from '../Vector2'
import {
	AbstractRenderComponent,
	AbstractRenderComponentParameters,
	ViewPort,
} from './AbstractRenderComponent'

export abstract class AbstractTextRenderComponent extends AbstractRenderComponent {
	private _text: string

	public get text(): string {
		return this._text
	}

	public set text(v: string) {
		this._text = v
	}

	abstract get offset(): Vector2
	abstract get maxWidth(): number | undefined

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

	public Init(
		gameObjectRef: SafeReference<IGameObject>,
		parameters?: AbstractTextRenderComponentParameters
	): void {
		super.Init(gameObjectRef, parameters)
		if (parameters) {
			this.text = parameters.text
		}
	}
}

export class AbstractTextRenderComponentParameters extends AbstractRenderComponentParameters {
	text: string

	constructor(
		text: string,
		executionPriority: number = 0,
		label?: string,
		zOrder: number = 0
	) {
		super(executionPriority, label, zOrder)
		this.text = text
	}
}
