import { GameObjectComponent } from 'GameEngine/BaseComponents/GameObjectComponent'
import { HealthComponent } from './Health'
import { DestructibleWallData } from './MapData'

export class DestructibleWall extends GameObjectComponent {
	private _healthComponent: HealthComponent
	OnOwnerInit(): void {
		this._healthComponent = this.gameObjectRef.object.GetComponents(
			HealthComponent
		)[0] as any
	}

	public GetData(): DestructibleWallData {
		return new DestructibleWallData(
			this.gameObjectRef.object.position.Clone(),
			this._healthComponent.health,
			this.uuid
		)
	}
}
