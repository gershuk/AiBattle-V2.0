import { AbstractObjectComponent } from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { MetalData } from './MapData'

export class Metal extends AbstractObjectComponent {
	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {}
	OnFixedUpdateEnded(index: number): void {}

	public GetData(): MetalData {
		return new MetalData(this.owner.position.Clone(), this.uuid)
	}
}
