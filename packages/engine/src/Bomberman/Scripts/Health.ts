import {
	GameObjectComponent,
	ComponentParameters,
} from 'GameEngine/BaseComponents/GameObjectComponent'
import { IGameObject } from 'GameEngine/GameObject/IGameObject'
import { SafeReference } from 'GameEngine/ObjectBaseType/ObjectContainer'

export class HealthComponent extends GameObjectComponent {
	private _maxHealth: number
	private _health: number
	public get maxHealth(): number {
		return this._maxHealth
	}
	protected set maxHealth(v: number) {
		this._maxHealth = v
	}

	public get health(): number {
		return this._health
	}
	public set health(v: number) {
		this._health = v
	}

	public TakeDamage(damage: number) {
		if (this.health === 0) {
			console.warn('Already dead')
			return
		}

		this.health = Math.max(this.health - damage, 0)

		if (this.health === 0)
			this.gameObjectRef.object.scene.RemoveGameObjectsByFilter(
				r => r == this.gameObjectRef
			)
	}

	Init(
		gameObjectRef: SafeReference<IGameObject>,
		parameters?: HealthComponentParameters
	): void {
		super.Init(gameObjectRef, parameters)
		if (parameters) {
			this.health = parameters.health ?? parameters.maxHealth
			this.maxHealth = parameters.maxHealth
		}
	}
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
