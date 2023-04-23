import {
	StaticImageRenderComponent,
	StaticRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/StaticImageRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

export class BlastRender extends StaticImageRenderComponent {
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		const renderScale = (frameCount - currentFrame + 1) / frameCount
		const offset = (currentFrame + 1) / (frameCount * 2)
		this.size = new Vector2(renderScale, renderScale)
		this.offset = new Vector2(offset, offset)
	}

	OnFixedUpdateEnded(index: number): void {
		this.gameObjectRef.object.scene.RemoveGameObjectsByFilter(
			r => this.gameObjectRef === r
		)
	}
}
