import {
	AbstractObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { StaticRenderComponent } from 'GameEngine/BaseComponents/RenderComponents/StaticRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

export class Blast extends AbstractObjectComponent {
	OnFixedUpdateEnded(index: number): void {}
	private _turnToExplosion: number
	private _renderComponent: StaticRenderComponent

	Init(owner: IGameObject, parameters?: ComponentParameters): void {
		super.Init(owner, parameters)
		if (owner) {
			this._turnToExplosion =
				(owner.owner.turnIndex ? owner.owner.turnIndex : 1) + 1
			this._renderComponent = this.owner.GetComponents(
				StaticRenderComponent
			)[0] as any
		}
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		if (this._renderComponent) {
			const renderScale = (frameCount - currentFrame + 1) / frameCount
			const offset = (currentFrame + 1) / (frameCount * 2)
			this._renderComponent.size = new Vector2(renderScale, renderScale)
			this._renderComponent.offset = new Vector2(offset, offset)
		}
	}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {
		if (index === this._turnToExplosion) {
			this.owner.owner.RemoveGameObjectsByFilter(g => this.owner === g)
		}
	}
}
