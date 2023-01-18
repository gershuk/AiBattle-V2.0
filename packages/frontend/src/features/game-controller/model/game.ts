import { createEvent, createStore, sample } from 'effector'
import { createEngine, SceneParams } from 'libs/engine'
import { $selectedMap } from './select-map'

const engine = createEngine()

const $activeGame = createStore(false)

const $autoStep = createStore(false)

const startedGame = createEvent<SceneParams>()
const stoppedGame = createEvent()

const setAutoStep = createEvent<boolean>()

$activeGame.on(startedGame, () => true)
$activeGame.on(stoppedGame, () => false)

$autoStep.on(setAutoStep, (_, x) => x)
$autoStep.on([startedGame, stoppedGame], () => false)

sample({
	source: $selectedMap.map(selectedMap => selectedMap?.data || null),
	clock: startedGame,
	filter: Boolean,
	fn: (mapData, sceneParams) => ({ sceneParams, mapData }),
	target: engine.methods.init,
})

sample({
	clock: engine.methods.init.done,
	target: engine.methods.start,
})

sample({
	clock: stoppedGame,
	target: [
		engine.methods.stopAutoTurn.prepend(() => {}),
		setAutoStep.prepend(() => false),
	],
})

sample({
	clock: setAutoStep,
	filter: enable => enable,
	target: engine.methods.startAutoTurn.prepend(() => {}),
})

sample({
	clock: setAutoStep,
	filter: enable => !enable,
	target: engine.methods.stopAutoTurn.prepend(() => {}),
})

export { $activeGame, $autoStep, startedGame, stoppedGame, setAutoStep, engine }
