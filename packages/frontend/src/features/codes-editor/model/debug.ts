import { createEngine } from 'api'
import { sample } from 'effector'
import { createFormValuesSaver } from 'libs'

const { $values: $formValues, setFieldValue } = createFormValuesSaver({
	initialValues: {
		mapName: null,
		sceneParams: {
			tileSize: 30,
			maxTurnIndex: 1000000,
			animTicksCount: 60,
			animTicksTime: 12,
			autoTurnTime: 1100,
		},
	},
})

const {
	CanvasComponent,
	$startedAutoTurn,
	methods: engineMethods,
} = createEngine()

sample({
	clock: engineMethods.init.done,
	target: engineMethods.start,
})

sample({
	clock: engineMethods.start.done,
	target: engineMethods.startAutoTurn,
})

export {
	CanvasComponent,
	engineMethods,
	$startedAutoTurn,
	$formValues,
	setFieldValue,
}
