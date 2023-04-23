import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { ComponentParameters } from '../GameObjectComponent'
import { Vector2 } from '../Vector2'
import { StaticRenderComponentParameters } from './StaticImageRenderComponent'
import { AbstractImageRenderComponent } from './AbstractImageRenderComponent'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export class AnimationRenderComponent extends AbstractImageRenderComponent {
	private _frameIndex: number
	private _frames: AnimationFrame[]

	public get CurrentFrameData(): StaticRenderComponentParameters {
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

	public get zOrder(): number {
		return this.CurrentFrameData.zOrder
	}

	public get image(): HTMLImageElement {
		return this.CurrentFrameData.image
	}

	Init(gameObjectRef: SafeReference<IGameObject>, parameters?: AnimationRenderComponentParameters) {
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

export class AnimationRenderComponentParameters extends ComponentParameters {
	frames: AnimationFrame[]
	constructor(frames: AnimationFrame[]) {
		super()
		this.frames = frames
	}
}
export class AnimationFrame {
	frame: StaticRenderComponentParameters
	part: number
	constructor(frame: StaticRenderComponentParameters, part: number) {
		this.frame = frame
		this.part = part
	}
}
