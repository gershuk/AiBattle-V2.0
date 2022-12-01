import { AbstractObjectComponent } from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { StaticRenderComponent } from 'GameEngine/BaseComponents/RenderComponents/StaticRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import { RandomNumber } from 'Utilities'

export class SimpleDemoComponent extends AbstractObjectComponent {
	private _newPosition: Vector2
	private _oldPosition: Vector2
	private _staticRenderComponent: any

	OnOwnerInit(): void {
		this.owner.position = new Vector2(
			RandomNumber(0, 100),
			RandomNumber(0, 100)
		)
		console.log(`Object init position ${this.owner.position.ToString()}`)
	}

	OnDestroy(): void {}

	OnSceneStart(): void {
		this._staticRenderComponent = this.owner.GetComponents(
			StaticRenderComponent
		)[0]
	}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}

	OnAfterFrameRender(currentFrame: number, frameCount: number): void {
		this.owner.position = Vector2.Lerp(
			this._oldPosition,
			this._newPosition,
			(currentFrame + 1) / frameCount
		)
		console.log(
			`Object moving position ${this.owner.position.ToString()} Frame:${currentFrame}`
		)
	}

	OnFixedUpdate(index: number): void {
		this._oldPosition = this.owner.position.Clone()
		this._newPosition = this.owner.owner.mousePositionOnCanvas.Sub(
			this._staticRenderComponent.size.DivScalar(1)
		)
		console.log(`New position ${this._newPosition.ToString()}`)
	}
}
