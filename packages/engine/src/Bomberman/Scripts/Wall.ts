import { GameObjectComponent } from 'GameEngine/BaseComponents/GameObjectComponent'
import { WallData as WallData } from './MapData'

export class Wall extends GameObjectComponent {
	public GetData(): WallData {
		return new WallData(this.gameObjectRef.object.position.Clone(), this.uuid)
	}
}
