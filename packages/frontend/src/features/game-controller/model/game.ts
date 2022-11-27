import { createEvent, createStore, sample } from 'effector'
import { createEngine } from 'libs/engine'

const engine = createEngine({})

const $activeGame = createStore(false)

const $autoStep = createStore(false)

const startedGame = createEvent()
const stoppedGame = createEvent()

const setAutoStep = createEvent<boolean>()

$activeGame.on(startedGame, () => true)
$activeGame.on(stoppedGame, () => false)

$autoStep.on(setAutoStep, (_, x) => x)
$autoStep.on([startedGame, stoppedGame], () => false)

sample({
	clock: startedGame,
	target: engine.methods.start,
})

sample({
	clock: stoppedGame,
	target: engine.methods.stopAutoTurn,
})

sample({
	clock: setAutoStep,
	filter: enable => enable,
	target: engine.methods.startAutoTurn,
})

sample({
	clock: setAutoStep,
	filter: enable => !enable,
	target: engine.methods.stopAutoTurn,
})

export { $activeGame, $autoStep, startedGame, stoppedGame, setAutoStep, engine }
