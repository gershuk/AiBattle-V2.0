import { GameObjectComponent } from 'GameEngine/BaseComponents/GameObjectComponent'
import { WallData as WallData } from './MapData'

export class Wall extends GameObjectComponent {
	public GetData(): WallData {
		return new WallData(this.gameObject.position.Clone(), this.uuid)
	}
}
