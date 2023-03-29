import { createEngine } from 'api'
import { sample } from 'effector'
import { createFormValuesSaver } from 'libs'

const { $values: $formValues, setFieldValue } = createFormValuesSaver({
	initialValues: {
		mapName: null,
		sceneParams: {
			tileSizeScale: 30,
			maxTurnIndex: 1000000,
			animTicksCount: 60,
			animTicksTime: 12,
			autoTurnTime: 1100,
			commandCalcTimeout: -1,
		},
	},
})

const debugGameCanvas = document.createElement('canvas')

const { methods: engineMethods, gameState: debugGameState } = createEngine({
	canvas: debugGameCanvas,
	isGameEnd: () => false,
})

sample({
	clock: engineMethods.init.done,
	target: engineMethods.start,
})

sample({
	clock: engineMethods.start.done,
	target: engineMethods.startAutoTurn,
})

export {
	debugGameCanvas,
	engineMethods,
	setFieldValue,
	$formValues,
	debugGameState,
}
