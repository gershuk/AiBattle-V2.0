import {
	GameEngine,
	GameEngineParameters,
	ImageLoader,
	SceneParameters,
	SimpleDemo,
	SimpleDemoEngineParameters,
} from '@ai-battle/engine'
import { attach, createStore, combine } from 'effector'
import { createEngineCanvas } from './engine-canvas'

export interface SceneParams {
	maxTurnIndex: number
	animTicksCount: number
	animTicksTime: number
	autoTurnTime: number
}

const createEngine = ({ sceneParams }: { sceneParams?: SceneParams }) => {
	const { canvas, CanvasComponent } = createEngineCanvas()

	const $canvas = createStore(canvas)

	const imageLoader = new ImageLoader()
	const engine = new SimpleDemo(
		new SimpleDemoEngineParameters(
			new SceneParameters(
				sceneParams?.maxTurnIndex ?? 1,
				sceneParams?.animTicksCount ?? 1,
				sceneParams?.animTicksTime ?? 1,
				sceneParams?.autoTurnTime ?? 1,
				canvas
			),
			imageLoader
		)
	)
	const $engine = createStore(engine)

	const init = attach({
		source: combine({ engine: $engine, canvas: $canvas }),
		effect: (
			{ engine, canvas },
			{ sceneParams }: { sceneParams: SceneParams }
		) => {
			engine.Init(
				new SimpleDemoEngineParameters(
					new SceneParameters(
						sceneParams?.maxTurnIndex ?? 1,
						sceneParams?.animTicksCount ?? 1,
						sceneParams?.animTicksTime ?? 1,
						sceneParams?.autoTurnTime ?? 1,
						canvas
					),
					imageLoader
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
