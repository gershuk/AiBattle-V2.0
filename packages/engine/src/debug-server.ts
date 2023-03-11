import { ControllerCreationData } from 'GameEngine/GameEngine'
import {
	BombermanGame,
	BombermanGameParameters,
	BombermanMap,
} from './Bomberman/Scripts/BombermanGame'
import { Vector2 } from './GameEngine/BaseComponents/Vector2'
import { SceneParameters } from './GameEngine/Scene/IScene'

const engine = new BombermanGame()
engine
	.Init(
		new BombermanGameParameters(
			new SceneParameters(
				1000000,
				60,
				12,
				1100,
				document.getElementById('canvas') as HTMLCanvasElement,
				50,
				10,
				10
			),
			new BombermanMap(
				[
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 0, 0, 1, 0, 0, 0, 0, 0, 2],
					[2, 0, 0, 1, 0, 0, 0, 0, 0, 2],
					[2, 1, 1, 1, 0, 0, 0, 0, 0, 2],
					[2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
					[2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
					[2, 0, 0, 0, 0, 0, 1, 1, 1, 2],
					[2, 0, 0, 0, 0, 0, 1, 0, 0, 2],
					[2, 0, 0, 0, 0, 0, 1, 0, 0, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				],
				[new Vector2(1, 1), new Vector2(8, 8)]
			),
			[
				new ControllerCreationData(
					'class Controller { \
					Init(info) {}\
					\
					GetRandomInt(min, max) {\
						min = Math.ceil(min);\
						max = Math.floor(max);\
						return Math.floor(Math.random() * (max - min)) + min;\
					}\
					\
					GetCommand(info) { \
						return {bombermanAction:this.GetRandomInt(0, 6)};\
					}\
					\
				} \
				new Controller()'
				),
				new ControllerCreationData(
					'class Controller { \
					Init(info) {}\
					\
					GetRandomInt(min, max) {\
						min = Math.ceil(min);\
						max = Math.floor(max);\
						return Math.floor(Math.random() * (max - min)) + min;\
					}\
					\
					GetCommand(info) { \
						return {bombermanAction:this.GetRandomInt(0, 6)};\
					}\
					\
				} \
				new Controller()'
				),
			]
		)
	)
	.then(() => {
		engine.Start().then(() => engine.StartAutoTurn())
	})
