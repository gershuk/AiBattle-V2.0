import { GridWorldSystem } from 'GameEngine/BaseComponents/GridWorldSystem/GridWorldSystem'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { GameObject } from 'GameEngine/GameObject/GameObject'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import { ManBody } from './ManBody'
import { BombController } from './BombController'

export class BombermanGrid extends GridWorldSystem {
	//ToDo : secure if 1 of the objects canceled the transition (although this is not possible now)
	public CheckAndFixMovementExceptions(): void {}

	public CanInitObject(ref: SafeReference<GameObject>): boolean {
		const cellData = this.GetCellData(ref.object.position)
		return (
			cellData == null ||
			cellData.length == 0 ||
			(cellData.length == 1 &&
				cellData[0].ref.object.GetComponents(ManBody).length == 1 &&
				ref.object.GetComponents(BombController).length == 1)
		)
	}

	public CanObjectMoveTo(
		ref: SafeReference<GameObject>,
		newPosition: Vector2
	): boolean {
		const cellData = this.GetCellData(newPosition)

		if (cellData == null) return true

		for (let data of cellData) {
			if (data) {
				if (data.newPosition == null) {
					return false
				}
			}
		}
		return true
	}
}
