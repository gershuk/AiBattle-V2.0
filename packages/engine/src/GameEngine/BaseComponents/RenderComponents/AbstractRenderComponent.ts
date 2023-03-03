import { GameObjectComponent } from '../GameObjectComponent'
import { Vector2 } from '../Vector2'

export class AbstractRenderComponent extends GameObjectComponent {
	public get offset(): Vector2 {
		return new Vector2()
	}

	public get size(): Vector2 {
		return new Vector2(1, 1)
	}

	public get zOrder(): number {
		return 1
	}

	public get Image(): HTMLImageElement {
		return undefined
	}
}
