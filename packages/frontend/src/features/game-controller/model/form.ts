import { createFormValuesSaver } from 'libs'

const { $values: $formValues, setFieldValue } = createFormValuesSaver({
	initialValues: {
		sceneParams: {
			tileSize: 30,
			maxTurnIndex: 1000000,
			animTicksCount: 60,
			animTicksTime: 12,
			autoTurnTime: 1100,
		},
	},
})

export { $formValues, setFieldValue }
