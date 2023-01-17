import { AbstractObjectComponent } from '../AbstractObjectComponent'
import { Vector2 } from '../Vector2'

export abstract class AbstractRenderComponent extends AbstractObjectComponent {
	public abstract get offset(): Vector2

	public abstract get size(): Vector2

	public abstract get zOder(): number

	public abstract get Image(): HTMLImageElement
}
