import { createEvent, createStore, sample } from 'effector'

const $activeGame = createStore(false)

const $autoStep = createStore({ enable: false, time: 10 })

const startedGame = createEvent()
const stoppedGame = createEvent()
const toggleGame = createEvent()

const setAutoStep = createEvent<{
	enable: boolean
	time: number
}>()

$activeGame.on(startedGame, () => true)
$activeGame.on(stoppedGame, () => false)
$activeGame.on(toggleGame, x => !x)

$autoStep.on(setAutoStep, (_, x) => x)
$autoStep.on([startedGame, stoppedGame, toggleGame], () => ({
	enable: false,
	time: 10,
}))

export {
	$activeGame,
	startedGame,
	stoppedGame,
	toggleGame,
	$autoStep,
	setAutoStep,
}
