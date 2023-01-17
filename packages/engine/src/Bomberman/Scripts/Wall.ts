import {
	AbstractObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { HealthComponent } from './Health'
import { WallData } from './MapData'

export class Wall extends AbstractObjectComponent {
	private _healthComponent: HealthComponent
	OnOwnerInit(): void {
		this._healthComponent = this.owner.GetComponents(HealthComponent)[0] as any
	}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {}
	OnFixedUpdateEnded(index: number): void {}

	public GetData(): WallData {
		return new WallData(
			this.owner.position.Clone(),
			this._healthComponent.health,
			this.uuid
		)
	}
}
