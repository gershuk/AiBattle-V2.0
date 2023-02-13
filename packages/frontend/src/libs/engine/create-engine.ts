import {
	BombermanGame,
	BombermanGameParameters,
	BombermanMap,
	ImageLoader,
	SceneParameters,
	Vector2,
} from '@ai-battle/engine'
import { attach, createStore, combine, sample, createEvent } from 'effector'
import { MapData } from 'model'
import { createEngineCanvas } from './engine-canvas'

export interface SceneParams {
	maxTurnIndex: number
	animTicksCount: number
	animTicksTime: number
	autoTurnTime: number
	tileSize: number
}

export const createEngine = () => {
	const imageLoader = new ImageLoader()
	const engine = new BombermanGame()

	const $engine = createStore(engine)

	const $startedAutoTurn = createStore(false)
	const $mapData = createStore<MapData | null>(null)
	const $sceneParams = createStore<SceneParams | null>(null)

	const toggleAutoTurn = createEvent()
	const setMapData = createEvent<MapData | null>()
	const setSceneParams = createEvent<SceneParams | null>()

	const { canvas, CanvasComponent } = createEngineCanvas({
		$map: $mapData.map(mapData => mapData?.map || []),
		$tileSize: $sceneParams.map(sceneParams => sceneParams?.tileSize ?? 50),
	})
	const $canvas = createStore(canvas)

	$mapData.on(setMapData, (_, mapData) => mapData)
	$sceneParams.on(setSceneParams, (_, sceneParams) => sceneParams)

	const init = attach({
		source: combine({ engine: $engine, canvas: $canvas }),
		effect: (
			{ engine, canvas },
			{
				sceneParams,
				mapData,
				codesBot,
			}: { sceneParams: SceneParams; mapData: MapData; codesBot: string[] }
		) => {
			return engine.Init(
				new BombermanGameParameters(
					new SceneParameters(
						sceneParams?.maxTurnIndex ?? 1,
						sceneParams?.animTicksCount ?? 1,
						sceneParams?.animTicksTime ?? 1,
						sceneParams?.autoTurnTime ?? 1,
						canvas,
						sceneParams?.tileSize ?? 50
					),
					new BombermanMap(
						mapData.map,
						mapData.spawns.map(({ x, y }) => new Vector2(x, y))
					),
					codesBot
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

	sample({
		clock: startAutoTurn.done,
		fn: () => true,
		target: $startedAutoTurn,
	})

	sample({
		clock: stopAutoTurn.done,
		fn: () => false,
		target: $startedAutoTurn,
	})

	sample({
		source: $startedAutoTurn,
		clock: toggleAutoTurn,
		filter: startedAutoTurn => startedAutoTurn,
		target: stopAutoTurn,
	})

	sample({
		source: $startedAutoTurn,
		clock: toggleAutoTurn,
		filter: startedAutoTurn => !startedAutoTurn,
		target: startAutoTurn,
	})

	sample({
		clock: init.done,
		fn: ({ params }) => params.mapData,
		target: setMapData,
	})

	sample({
		clock: init.done,
		fn: ({ params }) => params.sceneParams,
		target: setSceneParams,
	})

	return {
		CanvasComponent,
		$startedAutoTurn,
		methods: {
			init,
			start,
			startAutoTurn,
			stopAutoTurn,
			doNextTurn,
			renderFrame,
			toggleAutoTurn,
		},
	}
}
