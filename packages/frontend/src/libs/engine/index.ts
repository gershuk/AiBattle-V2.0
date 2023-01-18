import {
	BombermanGame,
	BombermanGameParameters,
	BombermanMap,
	GameEngine,
	GameEngineParameters,
	ImageLoader,
	SceneParameters,
	SimpleDemo,
	SimpleDemoEngineParameters,
	Vector2,
} from '@ai-battle/engine'
import { attach, createStore, combine } from 'effector'
import { createEngineCanvas } from './engine-canvas'

export interface SceneParams {
	maxTurnIndex: number
	animTicksCount: number
	animTicksTime: number
	autoTurnTime: number
}

const createEngine = () => {
	const { canvas, CanvasComponent } = createEngineCanvas()

	const $canvas = createStore(canvas)

	const imageLoader = new ImageLoader()
	const engine = new BombermanGame()

	const $engine = createStore(engine)

	const init = attach({
		source: combine({ engine: $engine, canvas: $canvas }),
		effect: async (
			{ engine, canvas },
			{ sceneParams }: { sceneParams: SceneParams }
		) => {
			return engine
			  .Init(
				new BombermanGameParameters(
				  new SceneParameters(
					sceneParams?.maxTurnIndex ?? 1,
					sceneParams?.animTicksCount ?? 1,
					sceneParams?.animTicksTime ?? 1,
					sceneParams?.autoTurnTime ?? 1,
					canvas,
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
				  ]
				)
			  )
		},
	})

	const start = attach({
		source: $engine,
		effect: engine => engine.Start(),
	})

	const startAutoTurn = attach({
		source: $engine,
		effect: engine => engine.StartAutoTurn(),
	})

	const stopAutoTurn = attach({
		source: $engine,
		effect: engine => engine.StopAutoTurn(),
	})

	const doNextTurn = attach({
		source: $engine,
		effect: engine => engine.DoNextTurn(),
	})

	const renderFrame = attach({
		source: $engine,
		effect: engine => engine.RenderFrame(),
	})

	init.watch(params => {
		console.log('init engine with params:', params)
	})

	start.watch(() => {
		console.log('start engine')
	})

	startAutoTurn.watch(() => {
		console.log('startAutoTurn engine')
	})

	stopAutoTurn.watch(() => {
		console.log('stopAutoTurn engine')
	})

	doNextTurn.watch(() => {
		console.log('doNextTurn engine')
	})

	return {
		CanvasComponent,
		methods: {
			init,
			start,
			startAutoTurn,
			stopAutoTurn,
			doNextTurn,
			renderFrame,
		},
	}
}

export { createEngine }
