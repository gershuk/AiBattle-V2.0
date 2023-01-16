import {
	AbstractObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'

export class HealthComponent extends AbstractObjectComponent {
	private _maxHealth: number
	public get maxHealth(): number {
		return this._maxHealth
	}
	protected set maxHealth(v: number) {
		this._maxHealth = v
	}

	private _health: number
	public get health(): number {
		return this._health
	}
	public set health(v: number) {
		this._health = v
	}

	public TakeDamage(damage: number) {
		this.health = Math.max(this.health - damage, 0)

		if (this.health === 0)
			this.owner.owner.RemoveGameObjectsByFilter(g => g === this.owner)
	}

	Init(owner: IGameObject, parameters?: HealthComponentParameters): void {
		super.Init(owner, parameters)
		if (parameters) {
			this.health = parameters.health ?? parameters.maxHealth
			this.maxHealth = parameters.maxHealth
		}
	}

	OnOwnerInit(): void {}
	OnDestroy(): void {}
	OnSceneStart(): void {}
	OnBeforeFrameRender(currentFrame: number, frameCount: number): void {}
	OnAfterFrameRender(currentFrame: number, frameCount: number): void {}
	OnFixedUpdate(index: number): void {}
	OnFixedUpdateEnded(index: number): void {}
}

export class HealthComponentParameters extends ComponentParameters {
	health: number | undefined
	maxHealth: number
	constructor(maxHealth: number = 1, health: number | undefined = undefined) {
		super()
		this.health = health
		this.maxHealth = maxHealth
	}
}
