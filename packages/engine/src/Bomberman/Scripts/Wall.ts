import { AbstractObjectComponent } from 'GameEngine/BaseComponents/AbstractObjectComponent'

export class Wall extends AbstractObjectComponent {
	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {}
	OnFixedUpdateEnded(index: number): void {}
}
