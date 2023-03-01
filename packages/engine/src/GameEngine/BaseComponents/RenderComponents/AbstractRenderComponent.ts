import { GameObjectComponent } from '../GameObjectComponent'
import { Vector2 } from '../Vector2'

export abstract class AbstractRenderComponent extends GameObjectComponent {
	public abstract get offset(): Vector2

	public abstract get size(): Vector2

	public abstract get zOrder(): number

	public abstract get Image(): HTMLImageElement
}
