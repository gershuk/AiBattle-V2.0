import { createFormValuesSaver } from 'libs'

const { $values: $formValues, setFieldValue } = createFormValuesSaver({
	initialValues: {
		sceneParams: {
			tileSizeScale: 30,
			maxTurnIndex: 1000000,
			animTicksCount: 60,
			animTicksTime: 12,
			autoTurnTime: 1100,
			commandCalcTimeout: -1,
		},
		bot: [],
		showPlayerName: false,
	},
})

export { $formValues, setFieldValue }
