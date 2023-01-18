import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import {
	AbstractObjectComponent,
	ComponentParameters,
} from '../AbstractObjectComponent'
import { Vector2 } from '../Vector2'
import { AbstractRenderComponent } from './AbstractRenderComponent'
import { StaticRenderComponentParameters } from './StaticRenderComponent'

export class AnimationRenderComponent extends AbstractRenderComponent {
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

	public get zOder(): number {
		return this.CurrentFrameData.zOder
	}

	public get Image(): HTMLImageElement {
		return this.CurrentFrameData.image
	}

	Init(owner: IGameObject, parameters?: AnimationRenderComponentParameters) {
		super.Init(owner, parameters)
		if (parameters) {
			if (parameters instanceof AnimationRenderComponentParameters) {
				this._frameIndex = 0
				this._frames = parameters.frames
			} else {
				throw new Error(
					'Expect parameters of type AnimationRenderComponentParameters'
				)
			}
		}
	}

	OnFixedUpdateEnded(index: number): void {}
	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {
		const part = (currentFrame + 1) / frameCount
		while (part > this.CurrentPart) {
			this._frameIndex++
		}
	}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
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
