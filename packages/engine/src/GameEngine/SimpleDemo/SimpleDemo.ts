import {
	StaticRenderComponent,
	StaticRenderComponentParameters,
} from 'GameEngine/BaseComponents/RenderComponents/StaticRenderComponent'
import { Vector2 } from 'GameEngine/BaseComponents/Vector2'
import {
	GameEngine,
	GameEngineParameters,
	IGameEngine,
} from 'GameEngine/GameEngine'
import { GameObject } from 'GameEngine/GameObject/GameObject'
import { ImageLoader } from 'GameEngine/ResourceStorage/ImageLoader'
import { SceneParameters } from 'GameEngine/Scene/IScene'
import { Scene } from 'GameEngine/Scene/Scene'
import { SimpleDemoComponent } from './SimpleDemoComponent'

export class SimpleDemo extends GameEngine {
	// constructor(parameters: SimpleDemoEngineParameters) {
	// 	super(parameters)
	// }

	async Init(parameters: GameEngineParameters) {
		super.Init(parameters)

		if (parameters instanceof SimpleDemoEngineParameters) {
			this.scene = new Scene(parameters.sceneParameters)
			const gameObject = new GameObject(new Vector2())
			this.imageLoader
				.LoadPng('./Resources/test.png')
				.then(image =>
					this.scene.AddGameObject(new Vector2(), gameObject, [
						[new SimpleDemoComponent()],
						[
							new StaticRenderComponent(),
							new StaticRenderComponentParameters(new Vector2(5, 5), image),
						],
					])
				)
		} else {
			throw new Error(
				'Wrong parameters type. Expected SimpleDemoEngineParameters.'
			)
		}
	}
}

export class SimpleDemoEngineParameters extends GameEngineParameters {
	constructor(sceneParameters: SceneParameters, imageLoader?: ImageLoader) {
		super(sceneParameters, imageLoader)
	}
}
