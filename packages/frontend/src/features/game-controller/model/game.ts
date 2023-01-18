import { combine, createEvent, createStore, sample } from 'effector'
import { createEngine } from 'libs/engine'
import { $codesData, MapData } from 'model'
import { ISubmitForm } from '../types'
import { $selectedMap } from './select-map'

const engine = createEngine()

const $activeGame = createStore(false)

const $autoStep = createStore(false)

const startedGame = createEvent<ISubmitForm>()
const stoppedGame = createEvent()

const setAutoStep = createEvent<boolean>()

$activeGame.on(startedGame, () => true)
$activeGame.on(stoppedGame, () => false)

$autoStep.on(setAutoStep, (_, x) => x)
$autoStep.on([startedGame, stoppedGame], () => false)

sample({
	source: combine({
		mapData: $selectedMap.map(
			selectedMap => (selectedMap?.data || null) as MapData
		),
		codes: $codesData,
	}),
	clock: startedGame,
	filter: ({ mapData }) => !!mapData,
	fn: ({ mapData, codes }, { sceneParams, bot }) => {
		const codesBot = bot
			.map(({ controller }) => codes[controller]?.content)
			.filter(Boolean)
		return {
			sceneParams,
			mapData,
			codesBot
		}
	},
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
