import {
	StaticImageRenderComponent,
	StaticRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/StaticImageRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

export class BlastRender extends StaticImageRenderComponent {
	private _turnToExplosion: number

	Init(
		gameObject: IGameObject,
		parameters?: StaticRenderComponentParameters
	): void {
		super.Init(gameObject, parameters)
		if (gameObject) {
			this._turnToExplosion =
				(gameObject.scene.turnIndex ? gameObject.scene.turnIndex : 1) + 1
		}
	}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		const renderScale = (frameCount - currentFrame + 1) / frameCount
		const offset = (currentFrame + 1) / (frameCount * 2)
		this.size = new Vector2(renderScale, renderScale)
		this.offset = new Vector2(offset, offset)
	}

	OnFixedUpdate(index: number): void {
		if (index === this._turnToExplosion) {
			this.gameObject.scene.RemoveGameObjectsByFilter(
				r => this.gameObject === r.object
			)
		}
	}
}
