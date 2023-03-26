import {
	BombermanGame,
	BombermanGameParameters,
	BombermanMap,
	ControllerCreationData,
	SceneParameters,
	Vector2,
} from '@ai-battle/engine'
import { attach, createStore, combine, sample, createEvent } from 'effector'
import { generateGuid } from 'libs'
import { MapData } from 'model'
import { createEngineCanvas } from './engine-canvas'
import { BotCodes, ControllerStorage, SceneParams } from './type'

export const createEngine = () => {
	const engine = new BombermanGame()

	const $engine = createStore(engine)
	const $controllers = createStore<ControllerStorage[]>([])

	const $startedAutoTurn = createStore(false)
	const $mapData = createStore<MapData | null>(null)
	const $sceneParams = createStore<SceneParams | null>(null)
	const $tileSize = createStore<number | null>(null)

	const setControllers = createEvent<ControllerStorage[]>()
	const toggleAutoTurn = createEvent()
	const setMapData = createEvent<MapData | null>()
	const setSceneParams = createEvent<SceneParams | null>()
	const setTileSize = createEvent<number>()

	const { canvas, CanvasComponent } = createEngineCanvas({
		$map: $mapData.map(mapData => mapData?.map || []),
		$tileSize: $tileSize,
		onChangeTileSize: newSize => {
			engine.tileSizeScale = newSize
			setTileSize(newSize)
		},
	})
	const $canvas = createStore(canvas)

	$controllers.on(setControllers, (_, newControllers) => newControllers)
	$mapData.on(setMapData, (_, mapData) => mapData)
	$sceneParams.on(setSceneParams, (_, sceneParams) => sceneParams)
	$tileSize.on(setTileSize, (_, newSize) => newSize)

	const gameWinFx = attach({
		source: { engine: $engine, controllers: $controllers },
		effect: ({ engine, controllers }) => {
			const gameInfo = engine.GetGameInfo()
			if (gameInfo.bodiesData.length === 1) {
				const lastBot = gameInfo.bodiesData[0]
				const findBot = controllers.find(
					controller => controller.guid === lastBot.controllerUUID
				)
				if (findBot) {
					return {
						status: 'win' as const,
						gameInfo,
						botWin: findBot,
					}
				}
			}
			return {
				status: 'unknown' as const,
				gameInfo,
				botWin: null,
			}
		},
	})

	const init = attach({
		source: combine({ engine: $engine, canvas: $canvas }),
		effect: async (
			{ engine, canvas },
			{
				sceneParams,
				mapData,
				codesBot,
			}: { sceneParams: SceneParams; mapData: MapData; codesBot: BotCodes[] }
		) => {
			const controllers = codesBot.map(({ code, codeName, botName }) => {
				const guid = generateGuid()
				return {
					guid,
					controller: new ControllerCreationData(code, guid),
					codeName,
					botName,
				}
			})
			await engine.Init(
				new BombermanGameParameters(
					new BombermanMap(
						mapData.map,
						mapData.spawns.map(({ x, y }) => new Vector2(x, y))
					),
					controllers.map(({ controller }) => controller),
					new SceneParameters(
						sceneParams?.maxTurnIndex ?? 1,
						sceneParams?.animTicksCount ?? 1,
						sceneParams?.animTicksTime ?? 1,
						sceneParams?.autoTurnTime ?? 1,
						canvas,
						sceneParams?.tileSizeScale ?? 50,
						sceneParams?.initTimeout,
						sceneParams?.commandCalcTimeout,
						sceneParams?.playModeParameters
					)
				)
			)
			engine.OnGameEnd.Unsubscribe(gameWinFx)
			engine.OnGameEnd.Subscribe(gameWinFx)
			return {
				controllers,
			}
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
		clock: stopAutoTurn.finally,
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
		clock: init.doneData,
		fn: ({ controllers }) => controllers,
		target: setControllers,
	})

	sample({
		clock: init.done,
		fn: ({ params }) => params.sceneParams,
		target: setSceneParams,
	})

	sample({
		source: $engine,
		clock: init.done,
		fn: engine => Number(engine.tileSizeScale),
		target: setTileSize,
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
		watchers: {
			gameWin: gameWinFx.doneData,
		},
	}
}
