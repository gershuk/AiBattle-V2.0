import {
	AbstractTextRenderComponent,
	AbstractTextRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/AbstractTextRenderComponent'
import { Vector2 } from '../Vector2'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export class PlayerNameRender extends AbstractTextRenderComponent {
	get offset(): Vector2 {
		return new Vector2()
	}
	get maxWidth(): number {
		return undefined
	}
	get font(): string {
		return '48px serif'
	}
	get textAlign(): CanvasTextAlign {
		return 'start'
	}
	get textBaseline(): CanvasTextBaseline {
		return 'middle'
	}
	get direction(): CanvasDirection {
		return 'inherit'
	}
	get fillStyle(): string | CanvasGradient | CanvasPattern {
		return 'orange'
	}
	get strokeStyle(): string | CanvasGradient | CanvasPattern {
		return 'black'
	}

	public Init(
		gameObjectRef: SafeReference<IGameObject>,
		parameters?: PlayerNameRenderParameters
	): void {
		super.Init(gameObjectRef, parameters)
	}
}

export class PlayerNameRenderParameters extends AbstractTextRenderComponentParameters {
	constructor(
		text: string,
		executionPriority: number = 0,
		label?: string,
		zOrder: number = 0
	) {
		super(text, executionPriority, label, zOrder)
	}
}
