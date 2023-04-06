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
			new BombermanMap(
				[
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				],
				[new Vector2(1, 1), new Vector2(9, 1)]
			),
			[
				new ControllerCreationData(
					`
class Controller {
    step = 0;
    Init(info) {}
    
    GetCommand(info) { 
        this.step = this.step + 1;       
        if(this.step === 4) return { bombermanAction: 5 }
        if(this.step > 4 && this.step < 10) return { bombermanAction: 4 }
        return { bombermanAction: 2 }
    }
    
} 
`
				),
				new ControllerCreationData(
					`
class Controller {
    step = 0;
    Init(info) {}
    
    GetCommand(info) { 
        this.step = this.step + 1;    
		if(this.step === 4) return { bombermanAction: 5 }   
        if(this.step > 4 && this.step < 10) return { bombermanAction: 4 }
        return { bombermanAction: 2 }
    }
    
} 
`
				),
			],
			new SceneParameters(
				1000000,
				60,
				12,
				1100,
				document.getElementById('canvas') as HTMLCanvasElement,
				50,
				80,
				80
			)
		)
	)
	.then(() => {
		engine.Start().then(() => engine.StartAutoTurn())
	})
