import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { Vector2 } from '../Vector2'
import { Sprite } from './StaticImageRenderComponent'
import { AbstractImageRenderComponent } from './AbstractImageRenderComponent'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'
import { AbstractRenderComponentParameters } from './AbstractRenderComponent'

export class AnimationRenderComponent extends AbstractImageRenderComponent {
	protected _frameIndex: number
	protected _frames: AnimationFrame[]

	public get CurrentFrameData(): Sprite {
		return this._frames[this._frameIndex].frame
	}

	public get CurrentPart(): number {
		return this._frames[this._frameIndex].part
	}

	public get offset(): Vector2 {
		return this.CurrentFrameData.offset
	}

	public get size(): Vector2 {
		return this.CurrentFrameData.size
	}

	public get image(): HTMLImageElement {
		return this.CurrentFrameData.image
	}

	Init(
		gameObjectRef: SafeReference<IGameObject>,
		parameters?: AnimationRenderComponentParameters
	) {
		super.Init(gameObjectRef, parameters)
		if (parameters) {
			this._frameIndex = 0
			this._frames = parameters.frames
		}
	}

	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		const part = (currentFrame + 1) / frameCount
		while (part > this.CurrentPart) {
			this._frameIndex++
		}
	}

	OnFixedUpdate(index: number): void {
		this._frameIndex = 0
	}
}

export class AnimationRenderComponentParameters extends AbstractRenderComponentParameters {
	frames: AnimationFrame[]

	constructor(
		frames: AnimationFrame[],
		zOrder: number = 0,
		executionPriority: number = 0,
		label?: string
	) {
		super(executionPriority, label, zOrder)
		this.frames = frames
	}
}
export class AnimationFrame {
	frame: Sprite
	part: number
	constructor(frame: Sprite, part: number) {
		this.frame = frame
		this.part = part
	}
}
