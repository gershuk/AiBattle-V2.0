import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { AbstractObjectComponent, ComponentParameters } from '../AbstractObjectComponent'

export class StaticRenderComponent extends AbstractObjectComponent {
	private _xOffset: number
	public get xOffset(): number {
		return this._xOffset
	}
	protected set xOffset(x: number) {
		this._xOffset = x
	}

	private _yOffset: number
	public get yOffset(): number {
		return this._yOffset
	}
	protected set yOffset(y: number) {
		this._yOffset = y
	}

	private _Image: HTMLImageElement
	public get Image(): HTMLImageElement {
		return this._Image
	}
	protected set Image(image: HTMLImageElement) {
		this._Image = image
	}

    Init(owner: IGameObject, parameters?: ComponentParameters) {
		this._owner = owner
        if (parameters instanceof StaticRenderComponent)
        {
            this.xOffset = parameters.xOffset
            this.yOffset = parameters.yOffset
            this.Image = parameters.Image
        }
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {}
}

export class StaticRenderComponentComponents{
    _xOffset:number;
    _yOffset:number;
    _image:HTMLImageElement;
}
