import {
	AbstractObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

export class Blast extends AbstractObjectComponent {
	OnFixedUpdateEnded(index: number): void {}
	private _turnToExplosion: number

	Init(owner: IGameObject, parameters?: ComponentParameters): void {
		super.Init(owner, parameters)
		if (owner)
			this._turnToExplosion =
				(owner.owner.turnIndex ? owner.owner.turnIndex : 1) + 1
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {
		if (index === this._turnToExplosion) {
			this.owner.owner.RemoveGameObjectsByFilter(g => this.owner === g)
		}
	}
}
