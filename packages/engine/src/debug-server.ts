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
				50
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
				'class Controller { Init(info) {} GetCommand(info) { console.log(info);return 5;}} new Controller()',
				'class Controller { Init(info) {} GetCommand(info) { console.log(info);return 5;}} new Controller()',
			]
		)
	)
	.then(() => {
		engine.Start()
		engine.StartAutoTurn()
	})
