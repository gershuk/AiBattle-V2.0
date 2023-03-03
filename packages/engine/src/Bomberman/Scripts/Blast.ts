import {
	GameObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/GameObjectComponent'
import { StaticRenderComponent } from 'GameEngine/BaseComponents/RenderComponents/StaticRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export class Blast extends GameObjectComponent {
	private _turnToExplosion: number
	private _renderComponent: SafeReference<StaticRenderComponent>

	Init(gameObject: IGameObject, parameters?: ComponentParameters): void {
		super.Init(gameObject, parameters)
		if (gameObject) {
			this._turnToExplosion =
				(gameObject.scene.turnIndex ? gameObject.scene.turnIndex : 1) + 1
			this._renderComponent = this.gameObject.GetComponents(
				StaticRenderComponent
			)[0] as SafeReference<StaticRenderComponent>
		}
	}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		if (this._renderComponent) {
			const renderScale = (frameCount - currentFrame + 1) / frameCount
			const offset = (currentFrame + 1) / (frameCount * 2)
			this._renderComponent.object.size = new Vector2(renderScale, renderScale)
			this._renderComponent.object.offset = new Vector2(offset, offset)
		}
	}

	OnFixedUpdate(index: number): void {
		if (index === this._turnToExplosion) {
			this.gameObject.scene.RemoveGameObjectsByFilter(
				r => this.gameObject === r.object
			)
		}
	}
}
