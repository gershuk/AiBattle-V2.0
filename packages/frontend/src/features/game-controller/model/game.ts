import { combine, createEvent, createStore, sample } from 'effector'
import { BotCodes, createEngine } from 'api'
import { $codesData, MapData } from 'model'
import { SubmitForm } from '../types'
import { $selectedMap } from './select-map'
import { showMessage } from 'ui'
import { createTranslation } from 'libs'

const { getTranslationItem } = createTranslation({
	ru: {
		error: 'Ошибка',
		errorMsg: 'Незарегистрированное поведение окончание игры.',
		win: 'Победа!',
		botWin: 'Победил',
	},
	en: {
		error: 'Error',
		errorMsg: 'Unregistered game over behavior.',
		win: 'Win!',
		botWin: 'Bot won',
	},
})

const engine = createEngine()

const $activeGame = createStore(false)

const startedGame = createEvent<SubmitForm>()
const stoppedGame = createEvent()

$activeGame.on(engine.methods.start.done, () => true)
$activeGame.on(stoppedGame, () => false)

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
		const codesBot: BotCodes[] = bot
			.filter(({ controller }) => !!codes[controller])
			.map(({ controller, name }) => ({
				botName: name,
				codeName: codes[controller].name,
				code: codes[controller].content,
			}))

		return {
			sceneParams,
			mapData,
			codesBot,
		}
	},
	target: engine.methods.init,
})

sample({ clock: engine.methods.init.done, target: engine.methods.start })

sample({ clock: stoppedGame, target: engine.methods.stopAutoTurn })

engine.watchers.gameWin.watch(({ status, botWin }) => {
	if (status === 'unknown')
		showMessage({
			content: getTranslationItem('errorMsg'),
			title: getTranslationItem('error'),
		})
	if (status === 'win')
		showMessage({
			content: `${getTranslationItem('botWin')} - ${botWin.botName} (${
				botWin.codeName
			})`,
			title: getTranslationItem('win'),
		})
})

const $playingGameInfo = combine(
	$activeGame,
	engine.$gameInfo,
	engine.$controllers,
	(activeGame, gameInfo, controllers) => {
		if (!gameInfo || !activeGame) return null
		const currentBotsCount = gameInfo.bodiesData.length
		const botsCount = controllers.length
		const botsInfo = controllers.map(controller => {
			const data = gameInfo.bodiesData.find(
				({ controllerUUID }) => controller.guid === controllerUUID
			)
			if (data) {
				return {
					guid: controller.guid,
					botName: controller.botName,
					codeName: controller.codeName,
					position: { x: data.position.x, y: data.position.y },
					status: 'alive' as const,
				}
			}
			return {
				guid: controller.guid,
				status: 'died' as const,
				botName: controller.botName,
				codeName: controller.codeName,
				position: null,
			}
		})
		return {
			currentBotsCount,
			botsCount,
			currentStep: gameInfo.currentTurnNumber,
			maxStep: gameInfo.maxTurnIndex,
			botsInfo,
		}
	}
)

export { $activeGame, $playingGameInfo, startedGame, stoppedGame, engine }
