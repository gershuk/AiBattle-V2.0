import { GameObjectComponent } from 'GameEngine/BaseComponents/GameObjectComponent'
import { HealthComponent } from './Health'
import { DestructibleWallData } from './MapData'

export class DestructibleWall extends GameObjectComponent {
	private _healthComponent: HealthComponent
	OnOwnerInit(): void {
		this._healthComponent = this.gameObject.GetComponents(
			HealthComponent
		)[0] as any
	}

	public GetData(): DestructibleWallData {
		return new DestructibleWallData(
			this.gameObject.position.Clone(),
			this._healthComponent.health,
			this.uuid
		)
	}
}
